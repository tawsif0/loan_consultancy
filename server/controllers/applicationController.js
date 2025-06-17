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
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: "Date query parameter is required" });
  }

  try {
    // Convert the input date to UTC date range to account for timezones
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    // Filter applications by the selected date range in UTC
    const [applications] = await pool.query(
      `SELECT * FROM loan_applications 
       WHERE createdAt BETWEEN ? AND ?
       ORDER BY createdAt DESC`,
      [startDate.toISOString(), endDate.toISOString()]
    );
    if (!applications.length) {
      return res
        .status(404)
        .json({ error: "No applications found for this date" });
    }

    const applicationsWithChambers = await Promise.all(
      applications.map(async (app) => {
        const [chambers] = await pool.query(
          `SELECT chamberPlaceName AS chamberPlaceName,
                  chamberAddress AS chamberAddress,
                  monthlyIncome AS monthlyIncome
           FROM chambers WHERE application_id = ?`,
          [app.id]
        );
        return { ...app, chambers };
      })
    );

    const doc = new pdfkit({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=loan_applications_${date}.pdf`
    );

    doc.pipe(res);
    doc.fontSize(18).text(`Loan Applications - ${date}`, { align: "center" });
    doc.moveDown();

    const formatDateForDisplay = (dateString) => {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Dhaka",
      });
    };

    // Generate the PDF content for the filtered applications only
    applicationsWithChambers.forEach((app, index) => {
      doc.fontSize(14).text(`${index + 1}. ${app.fullName} (${app.loanType})`);
      doc.fontSize(12).text(`Contact: ${app.contactNo || "-"}`);
      doc.text(
        `Required Amount: Tk ${parseFloat(
          app.requiredAmount || 0
        ).toLocaleString()}`
      );
      doc.text(`Date: ${formatDateForDisplay(app.createdAt)}`);

      doc.moveDown().font("Helvetica-Bold").text("Personal Information:");
      doc.font("Helvetica");
      if (app.presentAddress)
        doc.text(`Present Address: ${app.presentAddress}`);
      if (app.loanRequirementTime)
        doc.text(`Loan Requirement Time: ${app.loanRequirementTime}`);
      if (app.existingLoan) doc.text(`Existing Loan: ${app.existingLoan}`);
      if (app.existingLoan === "Yes" && app.paymentRegularity)
        doc.text(`Payment Regularity: ${app.paymentRegularity}`);
      if (app.comments) doc.text(`Comments: ${app.comments}`);

      // Improved Financial Information Section
      const hasValidFinancialData =
        (app.salaryType &&
          ((app.salaryType === "Bank Amount" && app.bankAmount > 0) ||
            (app.salaryType === "Cash Amount" && app.cashAmount > 0) ||
            (app.salaryType === "Bank & Cash Amount" &&
              app.bankAndCashAmount > 0))) ||
        (!app.salaryType &&
          (app.bankAmount > 0 ||
            app.cashAmount > 0 ||
            app.bankAndCashAmount > 0));

      if (hasValidFinancialData) {
        doc.moveDown().font("Helvetica-Bold").text("Financial Information:");
        doc.font("Helvetica");

        let amountToShow = 0;
        let salaryTypeToShow = app.salaryType || "Amount";
        let showAmount = false;

        if (app.salaryType) {
          // For applications with salary type
          if (
            app.salaryType === "Bank & Cash Amount" &&
            app.bankAndCashAmount > 0
          ) {
            amountToShow = app.bankAndCashAmount;
            showAmount = true;
          } else if (app.salaryType === "Bank Amount" && app.bankAmount > 0) {
            amountToShow = app.bankAmount;
            showAmount = true;
          } else if (app.salaryType === "Cash Amount" && app.cashAmount > 0) {
            amountToShow = app.cashAmount;
            showAmount = true;
          }
        } else {
          // For Govt Employees and others without salary type
          if (app.bankAmount > 0) {
            amountToShow = app.bankAmount;
            salaryTypeToShow = "Bank Amount";
            showAmount = true;
          } else if (app.cashAmount > 0) {
            amountToShow = app.cashAmount;
            salaryTypeToShow = "Cash Amount";
            showAmount = true;
          } else if (app.bankAndCashAmount > 0) {
            amountToShow = app.bankAndCashAmount;
            salaryTypeToShow = "Bank & Cash Amount";
            showAmount = true;
          }
        }

        if (showAmount) {
          doc.text(
            `${salaryTypeToShow}: Tk ${parseFloat(
              amountToShow
            ).toLocaleString()}`
          );
        }
      }

      if (app.loanType === "Doctor") {
        doc.moveDown().font("Helvetica-Bold").text("Doctor Information:");
        doc.font("Helvetica");
        if (app.bmdcAge) doc.text(`BMDC Age: ${app.bmdcAge}`);
        if (app.doctorType) doc.text(`Doctor Type: ${app.doctorType}`);
        if (app.doctorType !== "Only Chamber") {
          if (app.hospitalName) doc.text(`Hospital Name: ${app.hospitalName}`);
          if (app.hospitalAddress)
            doc.text(`Hospital Address: ${app.hospitalAddress}`);
          if (app.monthlySalaryFromHospital > 0)
            doc.text(
              `Monthly Salary From Hospital: Tk ${parseFloat(
                app.monthlySalaryFromHospital
              ).toLocaleString()}`
            );
        }

        if (app.chambers && app.chambers.length) {
          doc.moveDown().text("Chambers:");
          app.chambers.forEach((chamber, i) => {
            doc.text(`  Chamber ${i + 1}:`);
            doc.text(`    Place Name: ${chamber.chamberPlaceName || "-"}`);
            doc.text(`    Address: ${chamber.chamberAddress || "-"}`);
            doc.text(
              `    Monthly Income: Tk ${parseFloat(
                chamber.monthlyIncome || 0
              ).toLocaleString()}`
            );
          });
        } else {
          doc.text("No Chamber Info");
        }
      }

      if (app.loanType !== "Doctor") {
        doc.moveDown().font("Helvetica-Bold").text("Employment Information:");
        doc.font("Helvetica");
        if (app.department) doc.text(`Department: ${app.department}`);
        if (app.designation) doc.text(`Designation: ${app.designation}`);
        if (app.organizationAddress)
          doc.text(`Organization Address: ${app.organizationAddress}`);
        if (app.jobGrade) doc.text(`Job Grade: ${app.jobGrade}`);

        if (
          (app.loanType === "Teacher" && app.instituteAddress) ||
          ((app.loanType === "Private Job Holder" ||
            app.loanType === "Garments Job Holder") &&
            app.companyAddress)
        ) {
          doc.text(
            `Address: ${
              app.loanType === "Teacher"
                ? app.instituteAddress
                : app.companyAddress
            }`
          );
        }
      }

      if (index < applicationsWithChambers.length - 1) {
        doc.moveDown();
        doc
          .moveTo(doc.x, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke();
        doc.moveDown().moveDown();
      }
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
