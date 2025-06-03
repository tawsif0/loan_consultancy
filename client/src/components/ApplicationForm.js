import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ApplicationForm = () => {
  const navigate = useNavigate();

  const [loanType, setLoanType] = useState("Govt. Employee");
  const [salaryType, setSalaryType] = useState("");
  const [doctorType, setDoctorType] = useState("Job Holder");

  const [loanRequirementNumber, setLoanRequirementNumber] = useState("");
  const [loanRequirementUnit, setLoanRequirementUnit] = useState("");

  const [chambersJobHolder, setChambersJobHolder] = useState([]);
  const [chambersOnlyChamber, setChambersOnlyChamber] = useState([]);
  const [chambersJobHolderAndChamber, setChambersJobHolderAndChamber] =
    useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    requiredAmount: "",
    presentAddress: "",
    existingLoan: "No",
    paymentRegularity: "", // empty string initially
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
  });

  // Chambers initialization by doctorType
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
      if (name === "existingLoan" && value === "No") {
        return {
          ...prev,
          existingLoan: value,
          paymentRegularity: "", // clear paymentRegularity if no existing loan
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleLoanTypeChange = (e) => {
    setLoanType(e.target.value);
    setSalaryType("");
    setDoctorType("Job Holder");
    setChambersJobHolder([]);
    setChambersOnlyChamber([]);
    setChambersJobHolderAndChamber([]);
    setFormData((prev) => ({
      ...prev,
      existingLoan: "No",
      paymentRegularity: "Regular",
      designation: "",
      department: "",
      monthlySalaryFromHospital: "",
      bankAmount: "",
      cashAmount: "",
      bankAndCashAmount: "",
    }));
    setLoanRequirementNumber("");
    setLoanRequirementUnit("");
  };

  const handleDoctorTypeChange = (e) => {
    setDoctorType(e.target.value);
    setSalaryType("");
    setFormData((prev) => ({
      ...prev,
      monthlySalaryFromHospital: "",
      bankAmount: "",
      cashAmount: "",
      bankAndCashAmount: "",
    }));
  };

  const handleSalaryTypeChange = (e) => {
    setSalaryType(e.target.value);
    setFormData((prev) => ({
      ...prev,
      monthlySalaryFromHospital: "",
      bankAmount: "",
      cashAmount: "",
      bankAndCashAmount: "",
    }));
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
      <div key={idx} className="border rounded p-3 mb-3 position-relative">
        <h6>Chamber {idx + 1}</h6>
        {(doctorType === "Job Holder" || idx > 0) && (
          <Button
            variant="danger"
            size="sm"
            className="position-absolute"
            style={{ top: "5px", right: "5px" }}
            onClick={() => handleRemoveChamber(idx)}
          >
            Remove
          </Button>
        )}
        <Row className="mb-3">
          <Form.Group as={Col} controlId={`chamberPlaceName-${idx}`}>
            <Form.Label>Chamber Place Name</Form.Label>
            <Form.Control
              type="text"
              name="chamberPlaceName"
              value={chamber.chamberPlaceName}
              onChange={(e) => handleChamberChange(idx, e)}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId={`monthlyIncome-${idx}`}>
            <Form.Label>Monthly Income by Chamber</Form.Label>
            <Form.Control
              type="number"
              name="monthlyIncome"
              value={chamber.monthlyIncome}
              onChange={(e) => handleChamberChange(idx, e)}
              required
            />
          </Form.Group>
        </Row>
        <Form.Group controlId={`chamberAddress-${idx}`}>
          <Form.Label>Chamber Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="chamberAddress"
            value={chamber.chamberAddress}
            onChange={(e) => handleChamberChange(idx, e)}
            required
          />
        </Form.Group>
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const chambersForSubmit = {
      jobHolder: chambersJobHolder,
      onlyChamber: chambersOnlyChamber,
      jobHolderAndChamber: chambersJobHolderAndChamber,
    };

    const loanRequirementTimeCombined = `${loanRequirementNumber} ${loanRequirementUnit}`;

    const baseData = {
      ...formData,
      loanRequirementTime: loanRequirementTimeCombined,
    };

    // Only include chambers if Doctor
    if (loanType !== "Doctor") {
      delete baseData.chambers;
    }

    // Ensure salary_type is included and null for non-doctor types
    const salaryTypeToSend = loanType === "Doctor" ? salaryType : salaryType;

    const dataToSend =
      loanType === "Doctor"
        ? {
            loan_type: loanType,
            doctor_type: doctorType,
            salary_type: salaryTypeToSend,
            chambers: chambersForSubmit,
            ...baseData,
          }
        : {
            loan_type: loanType,
            salary_type: salaryTypeToSend,
            ...baseData,
          };

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to submit application"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit application. Please try again.");
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
    <Form onSubmit={handleSubmit} className="p-4">
      <h2>Loan Application Form</h2>

      <Form.Group className="mb-3" controlId="loanType">
        <Form.Label>Loan Type</Form.Label>
        <Form.Select value={loanType} onChange={handleLoanTypeChange}>
          <option>Govt. Employee</option>
          <option>Private Job Holder</option>
          <option>Garments Job Holder</option>
          <option>Doctor</option>
          <option>Teacher</option>
        </Form.Select>
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="contactNo">
          <Form.Label>Contact No</Form.Label>
          <Form.Control
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {/* Govt Employee */}
      {loanType === "Govt. Employee" && (
        <>
          <Form.Group className="mb-3" controlId="organizationName">
            <Form.Label>Organization Name</Form.Label>
            <Form.Control
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="department">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="designation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>

          {showSalaryAfterDesignation && (
            <>
              <Form.Group className="mb-3" controlId="salaryDropdown">
                <Form.Label>Salary</Form.Label>
                <Form.Select
                  value={salaryType}
                  onChange={handleSalaryTypeChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Bank Amount">Bank Amount</option>
                  <option value="Cash Amount">Cash Amount</option>
                  <option value="Bank & Cash Amount">Bank & Cash Amount</option>
                </Form.Select>
              </Form.Group>

              {salaryType === "Bank Amount" && (
                <Form.Group className="mb-3" controlId="bankAmount">
                  <Form.Label>Bank Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAmount"
                    value={formData.bankAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Cash Amount" && (
                <Form.Group className="mb-3" controlId="cashAmount">
                  <Form.Label>Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Bank & Cash Amount" && (
                <Form.Group className="mb-3" controlId="bankAndCashAmount">
                  <Form.Label>Bank & Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAndCashAmount"
                    value={formData.bankAndCashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}

          <Form.Group className="mb-3" controlId="organizationAddress">
            <Form.Label>Organization Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="organizationAddress"
              value={formData.organizationAddress}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="jobGrade">
              <Form.Label>Job Grade</Form.Label>
              <Form.Control
                type="text"
                name="jobGrade"
                value={formData.jobGrade}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
        </>
      )}

      {/* Private Job Holder and Garments Job Holder */}
      {(loanType === "Private Job Holder" ||
        loanType === "Garments Job Holder") && (
        <>
          <Form.Group className="mb-3" controlId="companyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="companyAddress">
            <Form.Label>Company Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="department">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="designation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>

          {showSalaryAfterDesignation && (
            <>
              <Form.Group className="mb-3" controlId="salaryDropdown">
                <Form.Label>Salary</Form.Label>
                <Form.Select
                  value={salaryType}
                  onChange={handleSalaryTypeChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Bank Amount">Bank Amount</option>
                  <option value="Cash Amount">Cash Amount</option>
                  <option value="Bank & Cash Amount">Bank & Cash Amount</option>
                </Form.Select>
              </Form.Group>

              {salaryType === "Bank Amount" && (
                <Form.Group className="mb-3" controlId="bankAmount">
                  <Form.Label>Bank Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAmount"
                    value={formData.bankAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Cash Amount" && (
                <Form.Group className="mb-3" controlId="cashAmount">
                  <Form.Label>Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Bank & Cash Amount" && (
                <Form.Group className="mb-3" controlId="bankAndCashAmount">
                  <Form.Label>Bank & Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAndCashAmount"
                    value={formData.bankAndCashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}
        </>
      )}

      {/* Teacher */}
      {loanType === "Teacher" && (
        <>
          <Form.Group className="mb-3" controlId="instituteName">
            <Form.Label>Institute Name</Form.Label>
            <Form.Control
              type="text"
              name="instituteName"
              value={formData.instituteName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="instituteAddress">
            <Form.Label>Institute Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="instituteAddress"
              value={formData.instituteAddress}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="designation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Row>

          {showSalaryAfterDesignation && (
            <>
              <Form.Group className="mb-3" controlId="salaryDropdown">
                <Form.Label>Salary</Form.Label>
                <Form.Select
                  value={salaryType}
                  onChange={handleSalaryTypeChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Bank Amount">Bank Amount</option>
                  <option value="Cash Amount">Cash Amount</option>
                  <option value="Bank & Cash Amount">Bank & Cash Amount</option>
                </Form.Select>
              </Form.Group>

              {salaryType === "Bank Amount" && (
                <Form.Group className="mb-3" controlId="bankAmount">
                  <Form.Label>Bank Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAmount"
                    value={formData.bankAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Cash Amount" && (
                <Form.Group className="mb-3" controlId="cashAmount">
                  <Form.Label>Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="cashAmount"
                    value={formData.cashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Bank & Cash Amount" && (
                <Form.Group className="mb-3" controlId="bankAndCashAmount">
                  <Form.Label>Bank & Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="bankAndCashAmount"
                    value={formData.bankAndCashAmount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}
        </>
      )}

      {/* Doctor */}
      {loanType === "Doctor" && (
        <>
          <Form.Group className="mb-3" controlId="doctorType">
            <Form.Label>Doctor Type</Form.Label>
            <Form.Select
              name="doctorType"
              value={doctorType}
              onChange={handleDoctorTypeChange}
            >
              <option value="Job Holder">Only Job Holder</option>
              <option value="Only Chamber">Only Chamber</option>
              <option value="Job Holder & Chamber">Job Holder & Chamber</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="bmdcAge">
            <Form.Label>BMDC Age</Form.Label>
            <Form.Control
              type="text"
              name="bmdcAge"
              value={formData.bmdcAge}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Doctor - Only Job Holder */}
          {doctorType === "Job Holder" && (
            <>
              <Form.Group className="mb-3" controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="designation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Salary dropdown & input */}
              {showSalaryAfterDesignation && (
                <>
                  <Form.Group className="mb-3" controlId="salaryDropdown">
                    <Form.Label>Salary</Form.Label>
                    <Form.Select
                      value={salaryType}
                      onChange={handleSalaryTypeChange}
                      required
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
                      <Form.Label>Bank Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAmount"
                        value={formData.bankAmount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Cash Amount" && (
                    <Form.Group className="mb-3" controlId="cashAmount">
                      <Form.Label>Cash Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="cashAmount"
                        value={formData.cashAmount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}

                  {salaryType === "Bank & Cash Amount" && (
                    <Form.Group className="mb-3" controlId="bankAndCashAmount">
                      <Form.Label>Bank & Cash Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="bankAndCashAmount"
                        value={formData.bankAndCashAmount}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}
                </>
              )}

              <Form.Group className="mb-3" controlId="hospitalName">
                <Form.Label>Hospital Name</Form.Label>
                <Form.Control
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="hospitalAddress">
                <Form.Label>Hospital Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                variant="outline-primary"
                onClick={handleAddChamber}
                className="mb-3"
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
                className="mb-3"
              >
                + Add Chamber
              </Button>
            </>
          )}

          {/* Doctor - Job Holder & Chamber salary section as per diagram */}
          {doctorType === "Job Holder & Chamber" && (
            <>
              <Form.Group className="mb-3" controlId="hospitalName">
                <Form.Label>Hospital Name</Form.Label>
                <Form.Control
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="hospitalAddress">
                <Form.Label>Hospital Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Monthly Salary From Hospital dropdown */}
              <Form.Group className="mb-3" controlId="salaryDropdown">
                <Form.Label>Monthly Salary From Hospital</Form.Label>
                <Form.Select
                  value={salaryType}
                  onChange={handleSalaryTypeChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Bank Amount">Bank Amount</option>
                  <option value="Cash Amount">Cash Amount</option>
                  <option value="Bank & Cash Amount">Bank & Cash Amount</option>
                </Form.Select>
              </Form.Group>

              {/* Input box below dropdown */}
              {salaryType === "Bank Amount" && (
                <Form.Group className="mb-3" controlId="monthlySalaryBank">
                  <Form.Label>Bank Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="monthlySalaryFromHospital"
                    value={formData.monthlySalaryFromHospital}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Cash Amount" && (
                <Form.Group className="mb-3" controlId="monthlySalaryCash">
                  <Form.Label>Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="monthlySalaryFromHospital"
                    value={formData.monthlySalaryFromHospital}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              {salaryType === "Bank & Cash Amount" && (
                <Form.Group className="mb-3" controlId="monthlySalaryBankCash">
                  <Form.Label>Bank & Cash Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="monthlySalaryFromHospital"
                    value={formData.monthlySalaryFromHospital}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
            </>
          )}
        </>
      )}

      <Row className="mb-3">
        <Form.Group as={Col} controlId="requiredAmount">
          <Form.Label>Required Amount</Form.Label>
          <Form.Control
            type="number"
            name="requiredAmount"
            value={formData.requiredAmount}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="loanRequirementNumber">
          <Form.Label>Loan Requirement Time</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={loanRequirementNumber}
            onChange={(e) => setLoanRequirementNumber(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="loanRequirementUnit">
          <Form.Label>&nbsp;</Form.Label>
          <Form.Select
            value={loanRequirementUnit}
            onChange={(e) => setLoanRequirementUnit(e.target.value)}
            required
          >
            <option value="">Select Unit</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </Form.Select>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="presentAddress">
        <Form.Label>Present Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="presentAddress"
          value={formData.presentAddress}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="existingLoan">
        <Form.Label>Existing Loan or Credit Card</Form.Label>
        <Form.Select
          name="existingLoan"
          value={formData.existingLoan}
          onChange={handleChange}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </Form.Select>
      </Form.Group>

      {formData.existingLoan === "Yes" && (
        <Form.Group className="mb-3" controlId="paymentRegularity">
          <Form.Label>Payment Regularity</Form.Label>
          <Form.Select
            name="paymentRegularity"
            value={formData.paymentRegularity}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
            <option value="Sometime Irregular">Sometime Irregular</option>
          </Form.Select>
        </Form.Group>
      )}

      <Form.Group className="mb-3" controlId="comments">
        <Form.Label>Comments</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="comments"
          value={formData.comments}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Submit Application
      </Button>
    </Form>
  );
};

export default ApplicationForm;
