const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const pdfkit = require("pdfkit");
exports.submitApplication = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // 1. Extract chambers data FIRST
    const chambers = req.body.chambers;

    // 2. Create application object WITHOUT spreading entire req.body
    const application = {
      id: uuidv4(),
      fullName: req.body.fullName,
      contactNo: req.body.contactNo,
      requiredAmount: req.body.requiredAmount
        ? parseFloat(req.body.requiredAmount)
        : null,
      presentAddress: req.body.presentAddress,
      existingLoan: req.body.existingLoan || "No",
      paymentRegularity: req.body.paymentRegularity || null,
      comments: req.body.comments || null,
      department: req.body.department || null,
      designation: req.body.designation || null,
      organizationName: req.body.organizationName || null,
      organizationAddress: req.body.organizationAddress || null,
      jobGrade: req.body.jobGrade || null,
      instituteName: req.body.instituteName || null,
      instituteAddress: req.body.instituteAddress || null,
      companyName: req.body.companyName || null,
      companyAddress: req.body.companyAddress || null,
      hospitalName: req.body.hospitalName || null,
      hospitalAddress: req.body.hospitalAddress || null,
      bmdcAge: req.body.bmdcAge || null,
      monthlySalaryFromHospital: req.body.monthlySalaryFromHospital
        ? parseFloat(req.body.monthlySalaryFromHospital)
        : null,
      bankAmount: req.body.bankAmount ? parseFloat(req.body.bankAmount) : null,
      cashAmount: req.body.cashAmount ? parseFloat(req.body.cashAmount) : null,
      bankAndCashAmount: req.body.bankAndCashAmount
        ? parseFloat(req.body.bankAndCashAmount)
        : null,
      doctorType: req.body.doctorType || null,
      loanRequirementTime: req.body.loanRequirementTime || null,
      loanType: req.body.loanType,
      salaryType: req.body.salaryType || null,
      createdAt: new Date(),
      updated_at: new Date(),
    };

    // Start transaction
    await connection.beginTransaction();

    // 3. Insert main application (no chambers field)
    await connection.query("INSERT INTO loan_applications SET ?", application);

    // 4. Process chambers separately (only for Doctors)
    if (
      application.loanType === "Doctor" &&
      chambers &&
      Array.isArray(chambers)
    ) {
      for (const chamber of chambers) {
        await connection.query(
          `INSERT INTO chambers 
           (chamber_id, application_id, chamberPlaceName, chamberAddress, monthlyIncome, chamber_type)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            uuidv4(),
            application.id,
            chamber.chamberPlaceName || null,
            chamber.chamberAddress || null,
            chamber.monthlyIncome ? parseFloat(chamber.monthlyIncome) : null,
            application.doctorType,
          ]
        );
      }
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error("Submission error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    connection.release();
  }
};
exports.getAllApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      "SELECT * FROM loan_applications ORDER BY createdAt DESC"
    );

    const applicationsWithChambers = await Promise.all(
      applications.map(async (app) => {
        try {
          const [chambers] = await pool.query(
            `SELECT 
              chamberPlaceName, 
              chamberAddress, 
              monthlyIncome,
              chamber_type
             FROM chambers 
             WHERE application_id = ?`,
            [app.id]
          );

          console.log(`Chambers for app ${app.id}:`, chambers); // Debug log

          // Initialize with empty arrays
          const groupedChambers = {
            jobHolder: [],
            onlyChamber: [],
            jobHolderAndChamber: [],
          };

          chambers.forEach((chamber) => {
            const chamberData = {
              chamberPlaceName: chamber.chamberPlaceName || "Not provided",
              chamberAddress: chamber.chamberAddress || "Not provided",
              monthlyIncome: chamber.monthlyIncome || 0,
            };

            if (chamber.chamber_type === "Job Holder") {
              groupedChambers.jobHolder.push(chamberData);
            } else if (chamber.chamber_type === "Only Chamber") {
              groupedChambers.onlyChamber.push(chamberData);
            } else if (chamber.chamber_type === "Job Holder & Chamber") {
              groupedChambers.jobHolderAndChamber.push(chamberData);
            }
          });

          return {
            ...app,
            chambers: groupedChambers,
          };
        } catch (error) {
          console.error(`Error processing app ${app.id}:`, error);
          return {
            ...app,
            chambers: {
              jobHolder: [],
              onlyChamber: [],
              jobHolderAndChamber: [],
            },
          };
        }
      })
    );

    res.json(applicationsWithChambers);
  } catch (err) {
    console.error("Error in getAllApplications:", err);
    res.status(500).json({
      error: "Failed to fetch applications",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
exports.getApplicationById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM loan_applications WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Application not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadApplicationsPDF = async (req, res) => {
  try {
    const { date, searchTerm, filterType } = req.query;

    // Base query with optional filters
    let query = `
      SELECT la.*, 
        GROUP_CONCAT(c.chamberPlaceName SEPARATOR '|') AS chamberPlaceNames,
        GROUP_CONCAT(c.chamberAddress SEPARATOR '|') AS chamberAddresses,
        GROUP_CONCAT(c.monthlyIncome SEPARATOR '|') AS chamberIncomes
      FROM loan_applications la
      LEFT JOIN chambers c ON la.id = c.application_id
      WHERE 1=1
    `;
    let params = [];

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      query += ` AND la.createdAt BETWEEN ? AND ?`;
      params.push(startDate.toISOString(), endDate.toISOString());
    }

    // Optional search term filter
    if (searchTerm) {
      query += ` AND (la.fullName LIKE ? OR la.contactNo LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Optional loan type filter
    if (filterType && filterType !== "all") {
      query += ` AND la.loanType = ?`;
      params.push(filterType);
    }
    // Group by application ID
    query += ` GROUP BY la.id ORDER BY la.createdAt DESC`;

    const [applications] = await pool.query(query, params);

    if (!applications.length) {
      return res
        .status(404)
        .json({ error: "No applications found with current filters" });
    }

    // Process chamber data
    const applicationsWithChambers = applications.map((app) => {
      const chambers = [];
      if (app.chamberPlaceNames) {
        const placeNames = app.chamberPlaceNames.split("|");
        const addresses = app.chamberAddresses.split("|");
        const incomes = app.chamberIncomes.split("|");

        for (let i = 0; i < placeNames.length; i++) {
          if (placeNames[i] && placeNames[i] !== "null") {
            chambers.push({
              chamberPlaceName: placeNames[i],
              chamberAddress: addresses[i],
              monthlyIncome: incomes[i],
            });
          }
        }
      }

      return {
        ...app,
        chambers: chambers.length ? chambers : null,
      };
    });

    // Create PDF document
    const doc = new pdfkit({
      margin: 30,
      size: "A4",
      info: {
        Title: "Loan Applications Report",
        Author: "Loan Application System",
        CreationDate: new Date(),
      },
    });

    // Set response headers
    let filename = "loan_applications";
    if (date) filename += `_${date}`;
    if (filterType && filterType !== "all")
      filename += `_${filterType.replace(/\s+/g, "_")}`;
    if (searchTerm) filename += `_search_${searchTerm.substring(0, 10)}`;
    if (!date && !searchTerm && (!filterType || filterType === "all"))
      filename += "_ALL_DATA";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add header with filter information
    doc.fontSize(18).text("Loan Applications Report", { align: "center" });
    doc.moveDown(0.5);

    // Filter information
    doc.fontSize(12);
    doc.text("Applied Filters:", { align: "left" });
    if (date) doc.text(`- Date: ${formatDateForDisplay(date)}`);
    if (searchTerm) doc.text(`- Search Term: "${searchTerm}"`);
    if (filterType && filterType !== "all")
      doc.text(`- Loan Type: ${filterType}`);
    if (!date && !searchTerm && (!filterType || filterType === "all")) {
      doc.text("- No filters: All applications");
    }
    doc.moveDown();
    doc.text(`Total Applications: ${applicationsWithChambers.length}`, {
      align: "center",
    });
    doc.moveDown();

    // Add line separator
    drawLineSeparator(doc);

    // Generate content for each application
    applicationsWithChambers.forEach((app, index) => {
      doc.fontSize(14).text(`${index + 1}. ${app.fullName || "N/A"}`, {
        underline: true,
      });

      // Basic info section
      doc.fontSize(12);
      doc.text(`Loan Type: ${app.loanType || "N/A"}`);
      doc.text(`Contact: ${app.contactNo || "N/A"}`);
      doc.text(`Required Amount: ${formatCurrency(app.requiredAmount)}`);
      doc.text(`Applied On: ${formatDateForDisplay(app.createdAt)}`);
      doc.moveDown(0.5);

      // Personal Information
      doc.font("Helvetica-Bold").text("Personal Information:");
      doc.font("Helvetica");
      addDetailIfExists(doc, "Present Address", app.presentAddress);
      addDetailIfExists(doc, "Loan Requirement Time", app.loanRequirementTime);
      addDetailIfExists(doc, "Existing Loan", app.existingLoan);
      if (app.existingLoan === "Yes") {
        addDetailIfExists(doc, "Payment Regularity", app.paymentRegularity);
      }
      addDetailIfExists(doc, "Comments", app.comments);
      doc.moveDown(0.5);

      // Financial Information
      doc.font("Helvetica-Bold").text("Financial Information:");
      doc.font("Helvetica");

      if (app.salaryType) {
        doc.text(`Salary Type: ${app.salaryType}`);
        if (app.salaryType === "Bank Amount" && app.bankAmount > 0) {
          doc.text(`Amount: ${formatCurrency(app.bankAmount)}`);
        } else if (app.salaryType === "Cash Amount" && app.cashAmount > 0) {
          doc.text(`Amount: ${formatCurrency(app.cashAmount)}`);
        } else if (
          app.salaryType === "Bank & Cash Amount" &&
          app.bankAndCashAmount > 0
        ) {
          doc.text(`Amount: ${formatCurrency(app.bankAndCashAmount)}`);
        }
      } else {
        // For Govt Employees or when salaryType is not set
        if (app.bankAmount > 0)
          doc.text(`Bank Amount: ${formatCurrency(app.bankAmount)}`);
        if (app.cashAmount > 0)
          doc.text(`Cash Amount: ${formatCurrency(app.cashAmount)}`);
        if (app.bankAndCashAmount > 0)
          doc.text(
            `Bank & Cash Amount: ${formatCurrency(app.bankAndCashAmount)}`
          );
      }
      doc.moveDown(0.5);

      // Doctor-specific information
      if (app.loanType === "Doctor") {
        doc.font("Helvetica-Bold").text("Doctor Information:");
        doc.font("Helvetica");
        addDetailIfExists(doc, "BMDC Age", app.bmdcAge);
        addDetailIfExists(doc, "Doctor Type", app.doctorType);

        if (app.doctorType !== "Only Chamber") {
          addDetailIfExists(doc, "Hospital Name", app.hospitalName);
          addDetailIfExists(doc, "Hospital Address", app.hospitalAddress);
          if (app.monthlySalaryFromHospital > 0) {
            doc.text(
              `Monthly Salary From Hospital: ${formatCurrency(
                app.monthlySalaryFromHospital
              )}`
            );
          }
        }

        if (app.chambers && app.chambers.length) {
          doc.moveDown(0.5);
          doc.font("Helvetica-Bold").text("Chamber Information:");
          doc.font("Helvetica");
          app.chambers.forEach((chamber, i) => {
            doc.text(`Chamber ${i + 1}:`);
            doc.text(`  Place Name: ${chamber.chamberPlaceName || "N/A"}`);
            doc.text(`  Address: ${chamber.chamberAddress || "N/A"}`);
            doc.text(
              `  Monthly Income: ${formatCurrency(chamber.monthlyIncome)}`
            );
          });
        }
        doc.moveDown(0.5);
      }

      // Employment Information for non-doctors
      if (app.loanType !== "Doctor") {
        doc.font("Helvetica-Bold").text("Employment Information:");
        doc.font("Helvetica");
        addDetailIfExists(doc, "Department", app.department);
        addDetailIfExists(doc, "Designation", app.designation);
        addDetailIfExists(doc, "Organization Address", app.organizationAddress);
        addDetailIfExists(doc, "Job Grade", app.jobGrade);

        if (app.loanType === "Teacher" && app.instituteAddress) {
          doc.text(`Institute Address: ${app.instituteAddress}`);
        } else if (
          (app.loanType === "Private Job Holder" ||
            app.loanType === "Garments Job Holder") &&
          app.companyAddress
        ) {
          doc.text(`Company Address: ${app.companyAddress}`);
        }
        doc.moveDown(0.5);
      }

      // Add separator between applications
      if (index < applicationsWithChambers.length - 1) {
        drawLineSeparator(doc);
        doc.moveDown();
      }
    });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({
      error: "Failed to generate PDF",
      details: err.message,
    });
  }
};

// Helper functions
function formatDateForDisplay(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatCurrency(amount) {
  if (!amount) return "Tk 0";
  return `Tk ${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function addDetailIfExists(doc, label, value) {
  if (value && value.toString().trim() !== "") {
    doc.text(`${label}: ${value}`);
  }
}

function drawLineSeparator(doc) {
  doc
    .moveTo(doc.x, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.5);
}
