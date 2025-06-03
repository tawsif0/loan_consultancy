import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/admin");
        } else {
          setError("Failed to fetch applications");
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getLoanTypeBadge = (type) => {
    const types = {
      "Govt. Employee": "primary",
      "Private Job Holder": "success",
      Doctor: "danger",
      "Garments Job Holder": "warning",
      Teacher: "info"
    };
    return <Badge bg={types[type] || "secondary"}>{type}</Badge>;
  };

  const renderDetails = (app) => {
    return (
      <Accordion className="mt-2">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Application Details</Accordion.Header>
          <Accordion.Body>
            <p>
              <strong>Present Address:</strong> {app.presentAddress}
            </p>
            <p>
              <strong>Loan Requirement Time:</strong> {app.loanRequirementTime}
            </p>
            <p>
              <strong>Existing Loan:</strong> {app.existingLoan}
            </p>
            <p>
              <strong>Payment Regularity:</strong> {app.paymentRegularity}
            </p>
            <p>
              <strong>Comments:</strong> {app.comments}
            </p>
            <p>
              <strong>Bank Amount:</strong> ৳{app.bankAmount}
            </p>
            <p>
              <strong>Cash Amount:</strong> ৳{app.cashAmount}
            </p>
            <p>
              <strong>Bank & Cash Amount:</strong> ৳{app.bankAndCashAmount}
            </p>

            {app.loanType === "Doctor" ? (
              <>
                <p>
                  <strong>BMDC Age:</strong> {app.bmdcAge}
                </p>
                <p>
                  <strong>Doctor Type:</strong> {app.doctorType}
                </p>
                {app.doctorType !== "Only Chamber" && (
                  <>
                    <p>
                      <strong>Hospital Name:</strong> {app.hospitalName}
                    </p>
                    <p>
                      <strong>Hospital Address:</strong> {app.hospitalAddress}
                    </p>
                    <p>
                      <strong>Monthly Salary (Hospital):</strong> ৳
                      {app.monthlySalaryFromHospital}
                    </p>
                  </>
                )}
                {(app.doctorType === "Only Chamber" ||
                  app.doctorType === "Job Holder & Chamber") && (
                  <>
                    <p>
                      <strong>Chamber Place Name:</strong>{" "}
                      {app.chamberPlaceName}
                    </p>
                    <p>
                      <strong>Chamber Address:</strong> {app.chamberAddress}
                    </p>
                    <p>
                      <strong>Monthly Income:</strong> ৳{app.monthlyIncome}
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <p>
                  <strong>Department:</strong> {app.department}
                </p>
                <p>
                  <strong>Designation:</strong> {app.designation}
                </p>
                <p>
                  <strong>Organization Address:</strong>{" "}
                  {app.organizationAddress}
                </p>
                <p>
                  <strong>Job Grade:</strong> {app.jobGrade}
                </p>
                <p>
                  <strong>Salary:</strong> ৳{app.salary}
                </p>
                {app.loanType === "Teacher" && (
                  <p>
                    <strong>Institute Address:</strong> {app.instituteAddress}
                  </p>
                )}
                {(app.loanType === "Private Job Holder" ||
                  app.loanType === "Garments Job Holder") && (
                  <p>
                    <strong>Company Address:</strong> {app.companyAddress}
                  </p>
                )}
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Loan Applications</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <React.Fragment key={app.id}>
                <tr>
                  <td>{app.fullName}</td>
                  <td>{app.contactNo}</td>
                  <td>{getLoanTypeBadge(app.loan_type)}</td>
                  <td>৳{parseFloat(app.requiredAmount).toLocaleString()}</td>
                  <td>{formatDate(app.createdAt)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() =>
                        setOpenDetailsId(
                          openDetailsId === app.id ? null : app.id
                        )
                      }
                    >
                      {openDetailsId === app.id ? "Hide" : "View"}
                    </Button>
                  </td>
                </tr>
                {openDetailsId === app.id && (
                  <tr>
                    <td colSpan="7">{renderDetails(app)}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPanel;
