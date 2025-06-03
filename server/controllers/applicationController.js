const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const pdfkit = require("pdfkit");
exports.submitApplication = async (req, res) => {
  try {
    const application = { ...req.body };
    const chambers = application.chambers;
    delete application.chambers;

    // Generate UUID for the application id
    application.id = uuidv4();

    // Insert main application data using UUID as id
    await pool.query("INSERT INTO loan_applications SET ?", application);

    const applicationId = application.id;

    if (chambers) {
      const chamberTypes = ["jobHolder", "onlyChamber", "jobHolderAndChamber"];

      for (const type of chamberTypes) {
        if (Array.isArray(chambers[type])) {
          for (const chamber of chambers[type]) {
            const chamberId = uuidv4(); // generate UUID for chamber_id
            await pool.query(
              `INSERT INTO chambers (chamber_id, application_id, chamber_place_name, chamber_address, monthly_income)
               VALUES (?, ?, ?, ?, ?)`,
              [
                chamberId,
                applicationId,
                chamber.chamberPlaceName || null,
                chamber.chamberAddress || null,
                chamber.monthlyIncome || null,
              ]
            );
          }
        }
      }
    }

    res.status(201).json({ id: applicationId, ...application });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      "SELECT * FROM loan_applications ORDER BY createdAt DESC"
    );

    // Fetch chambers for all applications in parallel and group by type keys
    const applicationsWithChambers = await Promise.all(
      applications.map(async (app) => {
        const [chambers] = await pool.query(
          `SELECT chamber_place_name AS chamberPlaceName, chamber_address AS chamberAddress, monthly_income AS monthlyIncome
           FROM chambers WHERE application_id = ?`,
          [app.id]
        );

        // Initialize grouped chambers object
        const groupedChambers = {
          jobHolder: [],
          onlyChamber: [],
          jobHolderAndChamber: [],
        };

        if (app.doctor_type === "Job Holder") {
          groupedChambers.jobHolder = chambers;
        } else if (app.doctor_type === "Only Chamber") {
          groupedChambers.onlyChamber = chambers;
        } else if (app.doctor_type === "Job Holder & Chamber") {
          groupedChambers.jobHolderAndChamber = chambers;
        }

        return {
          ...app,
          chambers: groupedChambers,
        };
      })
    );

    res.json(applicationsWithChambers);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    // Query applications created on this date (assuming createdAt is datetime)
    const [applications] = await pool.query(
      `SELECT * FROM loan_applications WHERE DATE(createdAt) = ? ORDER BY createdAt DESC`,
      [date]
    );

    if (!applications.length) {
      return res
        .status(404)
        .json({ error: "No applications found for this date" });
    }

    // For each application, fetch chambers
    const applicationsWithChambers = await Promise.all(
      applications.map(async (app) => {
        const [chambers] = await pool.query(
          `SELECT chamber_place_name AS chamberPlaceName,
                  chamber_address AS chamberAddress,
                  monthly_income AS monthlyIncome
           FROM chambers WHERE application_id = ?`,
          [app.id]
        );
        return { ...app, chambers };
      })
    );

    // Generate PDF using pdfkit
    const doc = new pdfkit({ margin: 30, size: "A4" });

    // Setup response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=loan_applications_${date}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text(`Loan Applications - ${date}`, { align: "center" });
    doc.moveDown();

    applicationsWithChambers.forEach((app, index) => {
      doc.fontSize(14).text(`${index + 1}. ${app.fullName} (${app.loan_type})`);
      doc.fontSize(12).text(`Contact: ${app.contactNo}`);
      doc.text(
        `Amount: ৳${parseFloat(app.requiredAmount || 0).toLocaleString()}`
      );
      doc.text(`Date: ${app.createdAt.toISOString().split("T")[0]}`);

      doc.text(`Present Address: ${app.presentAddress || "-"}`);
      doc.text(`Loan Requirement Time: ${app.loanRequirementTime || "-"}`);
      doc.text(`Existing Loan: ${app.existingLoan || "-"}`);
      if (app.existingLoan === "Yes") {
        doc.text(`Payment Regularity: ${app.paymentRegularity || "-"}`);
      }
      doc.text(`Comments: ${app.comments || "-"}`);

      doc.text(`Salary Type: ${app.salary_type || "-"}`);
      if (app.salary_type === "Bank Amount") {
        doc.text(
          `Bank Amount: ৳${parseFloat(app.bankAmount || 0).toLocaleString()}`
        );
      } else if (app.salary_type === "Cash Amount") {
        doc.text(
          `Cash Amount: ৳${parseFloat(app.cashAmount || 0).toLocaleString()}`
        );
      } else if (app.salary_type === "Bank & Cash Amount") {
        doc.text(
          `Bank Amount: ৳${parseFloat(app.bankAmount || 0).toLocaleString()}`
        );
        doc.text(
          `Cash Amount: ৳${parseFloat(app.cashAmount || 0).toLocaleString()}`
        );
        doc.text(
          `Bank & Cash Amount: ৳${parseFloat(
            app.bankAndCashAmount || 0
          ).toLocaleString()}`
        );
      }

      if (app.loan_type === "Doctor") {
        doc.text(`BMDC Age: ${app.bmdcAge || "-"}`);
        doc.text(`Doctor Type: ${app.doctor_type || "-"}`);
        if (app.doctor_type !== "Only Chamber") {
          doc.text(`Hospital Name: ${app.hospitalName || "-"}`);
          doc.text(`Hospital Address: ${app.hospitalAddress || "-"}`);
          if (app.monthlySalaryFromHospital > 0) {
            doc.text(
              `Monthly Salary From Hospital: ৳${parseFloat(
                app.monthlySalaryFromHospital
              ).toLocaleString()}`
            );
          }
        }
        if (app.chambers && app.chambers.length) {
          doc.text("Chambers:");
          app.chambers.forEach((chamber, i) => {
            doc.text(`  Chamber ${i + 1}:`);
            doc.text(`    Place Name: ${chamber.chamberPlaceName || "-"}`);
            doc.text(`    Address: ${chamber.chamberAddress || "-"}`);
            doc.text(
              `    Monthly Income: ৳${parseFloat(
                chamber.monthlyIncome || 0
              ).toLocaleString()}`
            );
          });
        } else {
          doc.text("No Chamber Info");
        }
      }

      if (index < applicationsWithChambers.length - 1) {
        doc.moveDown();
        doc.moveDown();
        doc
          .moveTo(doc.x, doc.y)
          .lineTo(doc.page.width - doc.page.margins.right, doc.y)
          .stroke();
        doc.moveDown();
      }
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
