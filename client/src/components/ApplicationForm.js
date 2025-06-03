import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("Govt. Employee");
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    requiredAmount: "",
    loanRequirementTime: "",
    presentAddress: "",
    existingLoan: "No",
    paymentRegularity: "Regular",
    comments: "",
    department: "",
    designation: "",
    organizationAddress: "",
    jobGrade: "",
    salary: "",
    instituteAddress: "",
    companyAddress: "",
    doctorType: "Job Holder",
    hospitalName: "",
    hospitalAddress: "",
    bmdcAge: "",
    chamberPlaceName: "",
    chamberAddress: "",
    monthlyIncome: "",
    monthlySalaryFromHospital: "",
    bankAmount: "",
    cashAmount: "",
    bankAndCashAmount: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoanTypeChange = (e) => {
    setLoanType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      loan_type: loanType,
      ...formData
    };

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
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

  // Render fields based on loan type
  const renderJobFields = () => (
    <>
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

        <Form.Group as={Col} controlId="salary">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {loanType === "Teacher" && (
        <Form.Group className="mb-3" controlId="instituteAddress">
          <Form.Label>Institute Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="instituteAddress"
            value={formData.instituteAddress}
            onChange={handleChange}
          />
        </Form.Group>
      )}

      {(loanType === "Private Job Holder" ||
        loanType === "Garments Job Holder") && (
        <Form.Group className="mb-3" controlId="companyAddress">
          <Form.Label>Company Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
          />
        </Form.Group>
      )}
    </>
  );

  const renderDoctorFields = () => (
    <>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="doctorType">
          <Form.Label>Doctor Type</Form.Label>
          <Form.Select
            name="doctorType"
            value={formData.doctorType}
            onChange={handleChange}
          >
            <option value="Job Holder">Job Holder</option>
            <option value="Only Chamber">Only Chamber</option>
            <option value="Job Holder & Chamber">Job Holder & Chamber</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="bmdcAge">
          <Form.Label>BMDC Age</Form.Label>
          <Form.Control
            type="text"
            name="bmdcAge"
            value={formData.bmdcAge}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Row>

      {(formData.doctorType === "Job Holder" ||
        formData.doctorType === "Job Holder & Chamber") && (
        <>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="hospitalName">
              <Form.Label>Hospital Name</Form.Label>
              <Form.Control
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="monthlySalaryFromHospital">
              <Form.Label>Monthly Salary From Hospital</Form.Label>
              <Form.Control
                type="number"
                name="monthlySalaryFromHospital"
                value={formData.monthlySalaryFromHospital}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

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
        </>
      )}

      {(formData.doctorType === "Only Chamber" ||
        formData.doctorType === "Job Holder & Chamber") && (
        <>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="chamberPlaceName">
              <Form.Label>Chamber Place Name</Form.Label>
              <Form.Control
                type="text"
                name="chamberPlaceName"
                value={formData.chamberPlaceName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} controlId="monthlyIncome">
              <Form.Label>Monthly Income by Chamber</Form.Label>
              <Form.Control
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="chamberAddress">
            <Form.Label>Chamber Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="chamberAddress"
              value={formData.chamberAddress}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </>
      )}
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="mb-4">Loan Application Form</h2>

      <Form.Group className="mb-3" controlId="loanType">
        <Form.Label>Loan Type</Form.Label>
        <Form.Select value={loanType} onChange={handleLoanTypeChange}>
          <option value="Govt. Employee">Govt. Employee</option>
          <option value="Private Job Holder">Private Job Holder</option>
          <option value="Doctor">Doctor</option>
          <option value="Garments Job Holder">Garments Job Holder</option>
          <option value="Teacher">Teacher</option>
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

        <Form.Group as={Col} controlId="loanRequirementTime">
          <Form.Label>Loan Requirement Time</Form.Label>
          <Form.Control
            type="text"
            name="loanRequirementTime"
            value={formData.loanRequirementTime}
            onChange={handleChange}
          />
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

      <Row className="mb-3">
        <Form.Group as={Col} controlId="existingLoan">
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

        <Form.Group as={Col} controlId="paymentRegularity">
          <Form.Label>Payment Regularity</Form.Label>
          <Form.Select
            name="paymentRegularity"
            value={formData.paymentRegularity}
            onChange={handleChange}
          >
            <option value="Regular">Regular</option>
            <option value="Irregular">Irregular</option>
            <option value="Sometime Irregular">Sometime Irregular</option>
          </Form.Select>
        </Form.Group>
      </Row>

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

      {(loanType === "Govt. Employee" ||
        loanType === "Private Job Holder" ||
        loanType === "Garments Job Holder" ||
        loanType === "Teacher") &&
        renderJobFields()}

      {loanType === "Doctor" && renderDoctorFields()}

      <h4 className="mb-3">Financial Details</h4>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="bankAmount">
          <Form.Label>Bank Amount</Form.Label>
          <Form.Control
            type="number"
            name="bankAmount"
            value={formData.bankAmount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="cashAmount">
          <Form.Label>Cash Amount</Form.Label>
          <Form.Control
            type="number"
            name="cashAmount"
            value={formData.cashAmount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="bankAndCashAmount">
          <Form.Label>Bank & Cash Amount</Form.Label>
          <Form.Control
            type="number"
            name="bankAndCashAmount"
            value={formData.bankAndCashAmount}
            onChange={handleChange}
          />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit" className="mt-3">
        Submit Application
      </Button>
    </Form>
  );
};

export default ApplicationForm;
