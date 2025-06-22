import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ApplicationForm.css";
import { useNavigate, useLocation } from "react-router-dom";

// Initial form data structure
const initialFormData = {
  fullName: "",
  contactNo: "",
  requiredAmount: "",
  presentAddress: "",
  existingLoan: "No",
  paymentRegularity: "",
  comments: "",
  department: "",
  designation: "",
  organizationName: "",
  organizationAddress: "",
  jobGrade: "",
  instituteName: "",
  instituteAddress: "",
  companyName: "",
  companyAddress: "",
  hospitalName: "",
  hospitalAddress: "",
  bmdcAge: "",
  monthlySalaryFromHospital: "",
  bankAmount: "",
  cashAmount: "",
  bankAndCashAmount: "",
};

const ApplicationForm = () => {
  const location = useLocation(); // This is correct for accessing state
  const loanTypeRef = useRef(null); // Create a ref for the loan type section
  const [loanType, setLoanType] = useState(
    location.state?.loanType || "Govt. Employee"
  );
  const [salaryType, setSalaryType] = useState("");
  const [doctorType, setDoctorType] = useState("Job Holder");
  const [loanRequirementNumber, setLoanRequirementNumber] = useState("");

  const [chambersJobHolder, setChambersJobHolder] = useState([]);
  const [chambersOnlyChamber, setChambersOnlyChamber] = useState([]);
  const [chambersJobHolderAndChamber, setChambersJobHolderAndChamber] =
    useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  //type selection of loan
  useEffect(() => {
    if (location.state?.scrollTo === "loanTypeSection" && loanTypeRef.current) {
      const element = loanTypeRef.current;
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight class
      element.classList.add("highlight-section");

      // Remove after animation
      setTimeout(() => {
        element.classList.remove("highlight-section");
      }, 2000);
    }
  }, [location.state]);

  useEffect(() => {
    if (loanType === "Doctor") {
      if (doctorType === "Only Chamber" && chambersOnlyChamber.length === 0) {
        setChambersOnlyChamber([
          { chamberPlaceName: "", chamberAddress: "", monthlyIncome: "" },
        ]);
      }
      if (
        doctorType === "Job Holder & Chamber" &&
        chambersJobHolderAndChamber.length === 0
      ) {
        setChambersJobHolderAndChamber([
          { chamberPlaceName: "", chamberAddress: "", monthlyIncome: "" },
        ]);
      }
      if (doctorType === "Job Holder" && chambersJobHolder.length === 0) {
        setChambersJobHolder([]);
      }
    } else {
      setChambersJobHolder([]);
      setChambersOnlyChamber([]);
      setChambersJobHolderAndChamber([]);
    }
  }, [loanType, doctorType]);

  const getCurrentChambers = () => {
    if (doctorType === "Job Holder")
      return [chambersJobHolder, setChambersJobHolder];
    if (doctorType === "Only Chamber")
      return [chambersOnlyChamber, setChambersOnlyChamber];
    if (doctorType === "Job Holder & Chamber")
      return [chambersJobHolderAndChamber, setChambersJobHolderAndChamber];
    return [[], () => {}];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newValue = [
        "requiredAmount",
        "monthlySalaryFromHospital",
        "bankAmount",
        "cashAmount",
        "bankAndCashAmount",
      ].includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value;

      if (name === "existingLoan" && value === "No") {
        return {
          ...prev,
          existingLoan: value,
          paymentRegularity: "",
          [name]: newValue,
        };
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleLoanTypeChange = (e) => {
    const newLoanType = e.target.value;
    setLoanType(newLoanType);
    setSalaryType("");
    setDoctorType("Job Holder");

    // Only reset chambers when switching to/from Doctor type
    if (newLoanType === "Doctor" || loanType === "Doctor") {
      setChambersJobHolder([]);
      setChambersOnlyChamber([]);
      setChambersJobHolderAndChamber([]);
    }

    // Don't reset formData here
    setLoanRequirementNumber("");
  };
  const handleDoctorTypeChange = (e) => {
    const newDoctorType = e.target.value;
    setDoctorType(newDoctorType);
    setSalaryType("");

    // Initialize chambers based on new doctor type
    if (newDoctorType === "Only Chamber" && chambersOnlyChamber.length === 0) {
      setChambersOnlyChamber([
        { chamberPlaceName: "", chamberAddress: "", monthlyIncome: "" },
      ]);
    } else if (
      newDoctorType === "Job Holder & Chamber" &&
      chambersJobHolderAndChamber.length === 0
    ) {
      setChambersJobHolderAndChamber([
        { chamberPlaceName: "", chamberAddress: "", monthlyIncome: "" },
      ]);
    } else if (newDoctorType === "Job Holder") {
      setChambersJobHolder([]);
    }
  };

  const handleSalaryTypeChange = (e) => {
    setSalaryType(e.target.value || null);
  };

  const handleAddChamber = () => {
    const [currentChambers, setChambersForType] = getCurrentChambers();
    setChambersForType([
      ...currentChambers,
      { chamberPlaceName: "", chamberAddress: "", monthlyIncome: "" },
    ]);
  };

  const handleRemoveChamber = (index) => {
    const [currentChambers, setChambersForType] = getCurrentChambers();
    if (
      (doctorType === "Only Chamber" ||
        doctorType === "Job Holder & Chamber") &&
      index === 0
    )
      return;
    const newChambers = currentChambers.filter((_, i) => i !== index);
    setChambersForType(newChambers);
  };

  const handleChamberChange = (index, e) => {
    const { name, value } = e.target;
    const [currentChambers, setChambersForType] = getCurrentChambers();
    const updated = [...currentChambers];
    updated[index] = { ...updated[index], [name]: value };
    setChambersForType(updated);
  };

  const renderChambers = () => {
    const [currentChambers] = getCurrentChambers();
    return currentChambers.map((chamber, idx) => (
      <div key={idx} className="application-chamber-card position-relative">
        <h6 className="application-chamber-title">Chamber {idx + 1}</h6>
        {(doctorType === "Job Holder" || idx > 0) && (
          <Button
            variant="danger"
            size="sm"
            className="application-remove-chamber"
            onClick={() => handleRemoveChamber(idx)}
          >
            Remove
          </Button>
        )}
        <Col>
          <Form.Group as={Col} controlId={`chamberPlaceName-${idx}`}>
            <Form.Label className="application-form-label">
              Chamber Place Name
            </Form.Label>
            <Form.Control
              type="text"
              name="chamberPlaceName"
              value={chamber.chamberPlaceName}
              onChange={(e) => handleChamberChange(idx, e)}
              required
              className="application-form-control"
            />
          </Form.Group>

          <Form.Group controlId={`chamberAddress-${idx}`}>
            <Form.Label className="application-form-label">
              Chamber Address
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="chamberAddress"
              value={chamber.chamberAddress}
              onChange={(e) => handleChamberChange(idx, e)}
              required
              className="application-form-control"
            />
          </Form.Group>
        </Col>
        <Form.Group as={Col} controlId={`monthlyIncome-${idx}`}>
          <Form.Label className="application-form-label">
            Monthly Income by Chamber
          </Form.Label>
          <Form.Control
            type="number"
            name="monthlyIncome"
            value={chamber.monthlyIncome}
            onChange={(e) => handleChamberChange(idx, e)}
            required
            className="application-form-control"
          />
        </Form.Group>
      </div>
    ));
  };

  const resetForm = () => {
    setLoanType("Govt. Employee");
    setSalaryType("");
    setDoctorType("Job Holder");
    setLoanRequirementNumber("");

    setChambersJobHolder([]);
    setChambersOnlyChamber([]);
    setChambersJobHolderAndChamber([]);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Prepare chambers data only for Doctors
      let chambersToSend = null;
      if (loanType === "Doctor") {
        const currentChambers =
          doctorType === "Job Holder"
            ? chambersJobHolder
            : doctorType === "Only Chamber"
            ? chambersOnlyChamber
            : chambersJobHolderAndChamber;

        chambersToSend = currentChambers.map((chamber) => ({
          chamberPlaceName: chamber.chamberPlaceName || "",
          chamberAddress: chamber.chamberAddress || "",
          monthlyIncome:
            chamber.monthlyIncome === "" ? null : Number(chamber.monthlyIncome),
        }));
      }

      // 2. Prepare payload (without chambers field for non-Doctor types)
      const payload = {
        fullName: formData.fullName,
        contactNo: formData.contactNo,
        requiredAmount:
          formData.requiredAmount === ""
            ? null
            : Number(formData.requiredAmount),
        presentAddress: formData.presentAddress,
        existingLoan: formData.existingLoan,
        paymentRegularity: formData.paymentRegularity || null,
        comments: formData.comments || null,
        department: formData.department || null,
        designation: formData.designation || null,
        organizationName: formData.organizationName || null,
        organizationAddress: formData.organizationAddress || null,
        jobGrade: formData.jobGrade || null,
        instituteName: formData.instituteName || null,
        instituteAddress: formData.instituteAddress || null,
        companyName: formData.companyName || null,
        companyAddress: formData.companyAddress || null,
        hospitalName: formData.hospitalName || null,
        hospitalAddress: formData.hospitalAddress || null,
        bmdcAge: formData.bmdcAge || null,
        monthlySalaryFromHospital:
          formData.monthlySalaryFromHospital === ""
            ? null
            : Number(formData.monthlySalaryFromHospital),
        bankAmount:
          formData.bankAmount === "" ? null : Number(formData.bankAmount),
        cashAmount:
          formData.cashAmount === "" ? null : Number(formData.cashAmount),
        bankAndCashAmount:
          formData.bankAndCashAmount === ""
            ? null
            : Number(formData.bankAndCashAmount),
        loanType: loanType,
        doctorType: loanType === "Doctor" ? doctorType : null,
        salaryType: salaryType || null,
        loanRequirementTime: loanRequirementNumber,
        chambers: chambersToSend, // Will be null for non-Doctor types
      };

      console.log("Submitting payload:", payload);

      // 3. Send request
      const response = await fetch(
        "https://loanapi.arbeitonline.top/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred during submission");
    }
  };
  const isDoctor = loanType === "Doctor";
  const isOnlyChamber = isDoctor && doctorType === "Only Chamber";
  const isJobHolderAndChamber =
    isDoctor && doctorType === "Job Holder & Chamber";
  const isJobHolderOnly = isDoctor && doctorType === "Job Holder";

  const showSalaryAfterDesignation =
    !isDoctor || isJobHolderOnly || loanType !== "Doctor";

  return (
    <div className="application-form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="application-form-card">
        <div className="application-form-header">
          <h2 className="application-form-title">Loan Application</h2>
          <p className="application-form-subtitle">
            Fill in your details to apply for a Personal loan
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="application-form">
          <div className="application-section">
            <h4 className="application-section-title">Personal Information</h4>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="fullName">
                <Form.Label className="application-form-label">
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="contactNo">
                <Form.Label className="application-form-label">
                  Contact No
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>
            </Row>

            <Form.Group ref={loanTypeRef} className="mb-4" controlId="loanType">
              <Form.Label className="application-form-label">
                Profession Type
              </Form.Label>
              <Form.Select
                value={loanType}
                onChange={handleLoanTypeChange}
                className="application-form-control"
              >
                <option>Govt. Employee</option>
                <option>Private Job Holder</option>
                <option>Garments Job Holder</option>
                <option>Doctor</option>
                <option>Teacher</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Govt Employee */}
          {loanType === "Govt. Employee" && (
            <div className="application-section">
              <h4 className="application-section-title">Employment Details</h4>
              <Form.Group className="mb-3" controlId="organizationName">
                <Form.Label className="application-form-label">
                  Organization Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="department">
                  <Form.Label className="application-form-label">
                    Department
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="application-form-control"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="designation">
                  <Form.Label className="application-form-label">
                    Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="application-form-control"
                  />
                </Form.Group>
              </Row>

              {showSalaryAfterDesignation && (
                <>
                  <Form.Group className="mb-3" controlId="bankAmount">
                    <Form.Label className="application-form-label">
                      Salary Amount
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="bankAmount"
                      value={formData.bankAmount}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  {salaryType === "Bank Amount" && (
                    <Form.Group className="mb-3" controlId="bankAmount">
                      <Form.Label className="application-form-label">
                        Bank Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAmount"
                        value={formData.bankAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Cash Amount" && (
                    <Form.Group className="mb-3" controlId="cashAmount">
                      <Form.Label className="application-form-label">
                        Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="cashAmount"
                        value={formData.cashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Bank & Cash Amount" && (
                    <Form.Group className="mb-3" controlId="bankAndCashAmount">
                      <Form.Label className="application-form-label">
                        Bank & Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAndCashAmount"
                        value={formData.bankAndCashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}
                </>
              )}

              <Form.Group className="mb-3" controlId="organizationAddress">
                <Form.Label className="application-form-label">
                  Organization Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="organizationAddress"
                  value={formData.organizationAddress}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="jobGrade">
                  <Form.Label className="application-form-label">
                    Job Grade
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="jobGrade"
                    value={formData.jobGrade}
                    onChange={handleChange}
                    className="application-form-control"
                  />
                </Form.Group>
              </Row>
            </div>
          )}

          {/* Private Job Holder and Garments Job Holder */}
          {(loanType === "Private Job Holder" ||
            loanType === "Garments Job Holder") && (
            <div className="application-section">
              <h4 className="application-section-title">Employment Details</h4>
              <Form.Group className="mb-3" controlId="companyName">
                <Form.Label className="application-form-label">
                  Company Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="companyAddress">
                <Form.Label className="application-form-label">
                  Company Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="department">
                  <Form.Label className="application-form-label">
                    Department
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="application-form-control"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="designation">
                  <Form.Label className="application-form-label">
                    Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="application-form-control"
                  />
                </Form.Group>
              </Row>

              {showSalaryAfterDesignation && (
                <>
                  <Form.Group className="mb-3" controlId="salaryDropdown">
                    <Form.Label className="application-form-label">
                      Salary
                    </Form.Label>
                    <Form.Select
                      value={salaryType || ""}
                      onChange={handleSalaryTypeChange}
                      required
                      className="application-form-control"
                    >
                      <option value="">-- Select --</option>
                      <option value="Bank Amount">Bank Amount</option>
                      <option value="Cash Amount">Cash Amount</option>
                      <option value="Bank & Cash Amount">
                        Bank & Cash Amount
                      </option>
                    </Form.Select>
                  </Form.Group>

                  {salaryType === "Bank Amount" && (
                    <Form.Group className="mb-3" controlId="bankAmount">
                      <Form.Label className="application-form-label">
                        Bank Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAmount"
                        value={formData.bankAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Cash Amount" && (
                    <Form.Group className="mb-3" controlId="cashAmount">
                      <Form.Label className="application-form-label">
                        Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="cashAmount"
                        value={formData.cashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Bank & Cash Amount" && (
                    <Form.Group className="mb-3" controlId="bankAndCashAmount">
                      <Form.Label className="application-form-label">
                        Bank & Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAndCashAmount"
                        value={formData.bankAndCashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}
                </>
              )}
            </div>
          )}

          {/* Teacher */}
          {loanType === "Teacher" && (
            <div className="application-section">
              <h4 className="application-section-title">Employment Details</h4>
              <Form.Group className="mb-3" controlId="instituteName">
                <Form.Label className="application-form-label">
                  Institute Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="instituteAddress">
                <Form.Label className="application-form-label">
                  Institute Address
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="instituteAddress"
                  value={formData.instituteAddress}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="designation">
                  <Form.Label className="application-form-label">
                    Designation
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="application-form-control"
                  />
                </Form.Group>
              </Row>

              {showSalaryAfterDesignation && (
                <>
                  <Form.Group className="mb-3" controlId="salaryDropdown">
                    <Form.Label className="application-form-label">
                      Salary
                    </Form.Label>
                    <Form.Select
                      value={salaryType || ""}
                      onChange={handleSalaryTypeChange}
                      required
                      className="application-form-control"
                    >
                      <option value="">-- Select --</option>
                      <option value="Bank Amount">Bank Amount</option>
                      <option value="Cash Amount">Cash Amount</option>
                      <option value="Bank & Cash Amount">
                        Bank & Cash Amount
                      </option>
                    </Form.Select>
                  </Form.Group>

                  {salaryType === "Bank Amount" && (
                    <Form.Group className="mb-3" controlId="bankAmount">
                      <Form.Label className="application-form-label">
                        Bank Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAmount"
                        value={formData.bankAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Cash Amount" && (
                    <Form.Group className="mb-3" controlId="cashAmount">
                      <Form.Label className="application-form-label">
                        Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="cashAmount"
                        value={formData.cashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Bank & Cash Amount" && (
                    <Form.Group className="mb-3" controlId="bankAndCashAmount">
                      <Form.Label className="application-form-label">
                        Bank & Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAndCashAmount"
                        value={formData.bankAndCashAmount}
                        onChange={handleChange}
                        required
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}
                </>
              )}
            </div>
          )}

          {/* Doctor */}
          {loanType === "Doctor" && (
            <div className="application-section">
              <h4 className="application-section-title">
                Professional Details
              </h4>
              <Form.Group className="mb-3" controlId="doctorType">
                <Form.Label className="application-form-label">
                  Doctor Type
                </Form.Label>
                <Form.Select
                  name="doctorType"
                  value={doctorType}
                  onChange={handleDoctorTypeChange}
                  className="application-form-control"
                >
                  <option value="Job Holder">Only Job Holder</option>
                  <option value="Only Chamber">Only Chamber</option>
                  <option value="Job Holder & Chamber">
                    Job Holder & Chamber
                  </option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="bmdcAge">
                <Form.Label className="application-form-label">
                  BMDC Age
                </Form.Label>
                <Form.Control
                  type="text"
                  name="bmdcAge"
                  value={formData.bmdcAge}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>

              {/* Doctor - Only Job Holder */}
              {doctorType === "Job Holder" && (
                <>
                  <Form.Group className="mb-3" controlId="department">
                    <Form.Label className="application-form-label">
                      Department
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="designation">
                    <Form.Label className="application-form-label">
                      Designation
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  {/* Salary dropdown & input */}
                  {showSalaryAfterDesignation && (
                    <>
                      <Form.Group className="mb-3" controlId="salaryDropdown">
                        <Form.Label className="application-form-label">
                          Salary
                        </Form.Label>
                        <Form.Select
                          value={salaryType || ""}
                          onChange={handleSalaryTypeChange}
                          required
                          className="application-form-control"
                        >
                          <option value="">-- Select --</option>
                          <option value="Bank Amount">Bank Amount</option>
                          <option value="Cash Amount">Cash Amount</option>
                          <option value="Bank & Cash Amount">
                            Bank & Cash Amount
                          </option>
                        </Form.Select>
                      </Form.Group>

                      {salaryType === "Bank Amount" && (
                        <Form.Group className="mb-3" controlId="bankAmount">
                          <Form.Label className="application-form-label">
                            Bank Amount
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="bankAmount"
                            value={formData.bankAmount}
                            onChange={handleChange}
                            required
                            className="application-form-control"
                          />
                        </Form.Group>
                      )}

                      {salaryType === "Cash Amount" && (
                        <Form.Group className="mb-3" controlId="cashAmount">
                          <Form.Label className="application-form-label">
                            Cash Amount
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="cashAmount"
                            value={formData.cashAmount}
                            onChange={handleChange}
                            required
                            className="application-form-control"
                          />
                        </Form.Group>
                      )}

                      {salaryType === "Bank & Cash Amount" && (
                        <Form.Group
                          className="mb-3"
                          controlId="bankAndCashAmount"
                        >
                          <Form.Label className="application-form-label">
                            Bank & Cash Amount
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="bankAndCashAmount"
                            value={formData.bankAndCashAmount}
                            onChange={handleChange}
                            required
                            className="application-form-control"
                          />
                        </Form.Group>
                      )}
                    </>
                  )}
                  <Form.Group className="mb-3" controlId="hospitalAddress">
                    <Form.Label className="application-form-label">
                      Hospital Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="hospitalName">
                    <Form.Label className="application-form-label">
                      Hospital Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  <Button
                    variant="outline-primary"
                    onClick={handleAddChamber}
                    className="application-add-chamber mb-3"
                  >
                    + Add Chamber
                  </Button>

                  {renderChambers()}
                </>
              )}

              {/* Doctor - Only Chamber and Job Holder & Chamber */}
              {(doctorType === "Only Chamber" ||
                doctorType === "Job Holder & Chamber") && (
                <>
                  {renderChambers()}
                  <Button
                    variant="outline-primary"
                    onClick={handleAddChamber}
                    className="application-add-chamber mb-3"
                  >
                    + Add Chamber
                  </Button>
                </>
              )}

              {/* Doctor - Job Holder & Chamber salary section as per diagram */}
              {doctorType === "Job Holder & Chamber" && (
                <>
                  <Form.Group className="mb-3" controlId="hospitalName">
                    <Form.Label className="application-form-label">
                      Hospital Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="hospitalAddress">
                    <Form.Label className="application-form-label">
                      Hospital Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={handleChange}
                      required
                      className="application-form-control"
                    />
                  </Form.Group>

                  {/* Monthly Salary From Hospital dropdown */}
                  <Form.Group className="mb-3" controlId="salaryDropdown">
                    <Form.Label className="application-form-label">
                      Monthly Salary From Hospital
                    </Form.Label>
                    <Form.Select
                      value={salaryType || ""}
                      onChange={handleSalaryTypeChange}
                      required
                      className="application-form-control"
                    >
                      <option value="">-- Select --</option>
                      <option value="Bank Amount">Bank Amount</option>
                      <option value="Cash Amount">Cash Amount</option>
                      <option value="Bank & Cash Amount">
                        Bank & Cash Amount
                      </option>
                    </Form.Select>
                  </Form.Group>

                  {/* Input box below dropdown */}
                  {salaryType === "Bank Amount" && (
                    <Form.Group className="mb-3" controlId="monthlySalaryBank">
                      <Form.Label className="application-form-label">
                        Bank Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="monthlySalaryFromHospital"
                        value={formData.monthlySalaryFromHospital}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: e.target.name,
                              value:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            },
                          })
                        }
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Cash Amount" && (
                    <Form.Group className="mb-3" controlId="monthlySalaryCash">
                      <Form.Label className="application-form-label">
                        Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="monthlySalaryFromHospital"
                        value={formData.monthlySalaryFromHospital}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: e.target.name,
                              value:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            },
                          })
                        }
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Bank & Cash Amount" && (
                    <Form.Group
                      className="mb-3"
                      controlId="monthlySalaryBankCash"
                    >
                      <Form.Label className="application-form-label">
                        Bank & Cash Amount
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="monthlySalaryFromHospital"
                        value={formData.monthlySalaryFromHospital}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: e.target.name,
                              value:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            },
                          })
                        }
                        className="application-form-control"
                      />
                    </Form.Group>
                  )}
                </>
              )}
            </div>
          )}

          <div className="application-section">
            <h4 className="application-section-title">Loan Details</h4>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="requiredAmount">
                <Form.Label className="application-form-label">
                  Required Amount
                </Form.Label>
                <Form.Control
                  type="number"
                  name="requiredAmount"
                  value={formData.requiredAmount}
                  onChange={handleChange}
                  required
                  className="application-form-control"
                />
              </Form.Group>
            </Row>

            <Row className="mb-3 loan-requirement-row align-items-end">
              <Form.Group as={Col} controlId="loanRequirementTime">
                <Form.Label className="application-form-label fw-bold">
                  Loan Requirement Time
                </Form.Label>
                <Form.Control
                  type="text"
                  value={loanRequirementNumber}
                  onChange={(e) => setLoanRequirementNumber(e.target.value)}
                  required
                  className="application-form-control"
                  placeholder="e.g. after 3 months"
                />
                <Form.Text className="text-muted">
                  Enter the duration you need the loan after (e.g. "6 months",
                  "1 year", "after 2 years")
                </Form.Text>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="presentAddress">
              <Form.Label className="application-form-label">
                Present Address
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
                required
                className="application-form-control"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="existingLoan">
              <Form.Label className="application-form-label">
                Existing Loan or Credit Card
              </Form.Label>
              <Form.Select
                name="existingLoan"
                value={formData.existingLoan}
                onChange={handleChange}
                className="application-form-control"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </Form.Select>
            </Form.Group>

            {formData.existingLoan === "Yes" && (
              <Form.Group className="mb-3" controlId="paymentRegularity">
                <Form.Label className="application-form-label">
                  Payment Regularity
                </Form.Label>
                <Form.Select
                  name="paymentRegularity"
                  value={formData.paymentRegularity}
                  onChange={handleChange}
                  className="application-form-control"
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                  <option value="Sometime Irregular">Sometime Irregular</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="comments">
              <Form.Label className="application-form-label">
                Comments
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="application-form-control"
              />
            </Form.Group>
          </div>

          <div className="application-submit-section">
            <Button
              variant="primary"
              type="submit"
              className="application-submit-button"
            >
              Submit Application
            </Button>
          </div>
        </Form>
        <div className="go-home-wrapper">
          <Button
            className="application-submit-buttons"
            onClick={() => navigate("/", { state: { fromButton: true } })}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
