import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateFilteredCount, setDateFilteredCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    if (selectedDate) {
      const filtered = applications.filter((app) => {
        const appDate = new Date(app.createdAt).toISOString().split("T")[0];
        return appDate === selectedDate;
      });
      setDateFilteredCount(filtered.length);
    } else {
      setDateFilteredCount(0);
    }
  }, [selectedDate, applications]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getLoanTypeBadge = (type) => {
    const types = {
      "Govt. Employee": "primary",
      "Private Job Holder": "success",
      Doctor: "danger",
      "Garments Job Holder": "warning",
      Teacher: "info",
    };
    return <Badge bg={types[type] || "secondary"}>{type}</Badge>;
  };

  const highlightSearchTerm = (text, term) => {
    if (!text || !term) return text;

    const regex = new RegExp(`(${term})`, "gi");
    return text
      .toString()
      .split(regex)
      .map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      );
  };

  const renderChambers = (chambersArray) => {
    if (!chambersArray?.length)
      return <p className="no-data">No Chamber Info</p>;

    return chambersArray.map((chamber, idx) => (
      <div key={idx} className="chamber-card">
        <h6>Chamber {idx + 1}</h6>
        <div className="detail-row">
          <span className="detail-label">Place Name:</span>
          <span className="detail-value">
            {highlightSearchTerm(chamber.chamberPlaceName || "-", searchTerm)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">
            {highlightSearchTerm(chamber.chamberAddress || "-", searchTerm)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Monthly Income:</span>
          <span className="detail-value">
            {chamber.monthlyIncome != null
              ? `৳${parseFloat(chamber.monthlyIncome).toLocaleString()}`
              : "-"}
          </span>
        </div>
      </div>
    ));
  };

  const DetailRow = ({ label, value, isCurrency, searchTerm }) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    )
      return null;
    return (
      <div className="detail-row">
        <span className="detail-label">{label}</span>
        <span className="detail-value">
          {isCurrency
            ? `৳${parseFloat(value).toLocaleString()}`
            : highlightSearchTerm(value, searchTerm)}
        </span>
      </div>
    );
  };

  const renderDetails = (app) => {
    const doctorTypeKeyMap = {
      "Job Holder": "jobHolder",
      "Only Chamber": "onlyChamber",
      "Job Holder & Chamber": "jobHolderAndChamber",
    };

    const doctorChambers =
      app.chambers?.[doctorTypeKeyMap[app.doctor_type]] || null;

    return (
      <Accordion className="details-accordion" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Application Details</Accordion.Header>
          <Accordion.Body>
            <div className="details-grid">
              <div className="detail-group">
                <h5 className="detail-group-title">Personal Information</h5>
                <DetailRow
                  label="Present Address:"
                  value={app.presentAddress}
                  searchTerm={searchTerm}
                />
                <DetailRow
                  label="Loan Requirement Time:"
                  value={app.loanRequirementTime}
                  searchTerm={searchTerm}
                />
                <DetailRow
                  label="Existing Loan:"
                  value={app.existingLoan}
                  searchTerm={searchTerm}
                />
                {app.existingLoan === "Yes" && (
                  <DetailRow
                    label="Payment Regularity:"
                    value={app.paymentRegularity}
                    searchTerm={searchTerm}
                  />
                )}
                <DetailRow
                  label="Comments:"
                  value={app.comments}
                  searchTerm={searchTerm}
                />
              </div>

              <div className="detail-group">
                <h5 className="detail-group-title">Financial Information</h5>
                <DetailRow
                  label="Salary Type:"
                  value={app.salary_type}
                  searchTerm={searchTerm}
                />
                {app.salary_type === "Bank Amount" && (
                  <DetailRow
                    label="Bank Amount:"
                    value={app.bankAmount}
                    isCurrency
                  />
                )}
                {app.salary_type === "Cash Amount" && (
                  <DetailRow
                    label="Cash Amount:"
                    value={app.cashAmount}
                    isCurrency
                  />
                )}
                {app.salary_type === "Bank & Cash Amount" && (
                  <>
                    <DetailRow
                      label="Bank Amount:"
                      value={app.bankAmount}
                      isCurrency
                    />
                    <DetailRow
                      label="Cash Amount:"
                      value={app.cashAmount}
                      isCurrency
                    />
                    <DetailRow
                      label="Bank & Cash Amount:"
                      value={app.bankAndCashAmount}
                      isCurrency
                    />
                  </>
                )}
              </div>

              {app.loan_type === "Doctor" && (
                <div className="detail-group">
                  <h5 className="detail-group-title">Doctor Information</h5>
                  <DetailRow
                    label="BMDC Age:"
                    value={app.bmdcAge}
                    searchTerm={searchTerm}
                  />
                  <DetailRow
                    label="Doctor Type:"
                    value={app.doctor_type}
                    searchTerm={searchTerm}
                  />

                  {app.doctor_type !== "Only Chamber" && (
                    <>
                      <DetailRow
                        label="Hospital Name:"
                        value={app.hospitalName}
                        searchTerm={searchTerm}
                      />
                      <DetailRow
                        label="Hospital Address:"
                        value={app.hospitalAddress}
                        searchTerm={searchTerm}
                      />
                      {app.monthlySalaryFromHospital > 0 && (
                        <DetailRow
                          label="Monthly Salary From Hospital:"
                          value={app.monthlySalaryFromHospital}
                          isCurrency
                        />
                      )}
                    </>
                  )}

                  {(app.doctor_type === "Job Holder" ||
                    app.doctor_type === "Only Chamber" ||
                    app.doctor_type === "Job Holder & Chamber") && (
                    <div className="chamber-section">
                      <h6 className="chamber-section-title">
                        Chamber Information
                      </h6>
                      {doctorChambers && doctorChambers.length > 0 ? (
                        renderChambers(doctorChambers)
                      ) : (
                        <p className="no-data">No Chamber Info</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {app.loan_type !== "Doctor" && (
                <div className="detail-group">
                  <h5 className="detail-group-title">Employment Information</h5>
                  <DetailRow
                    label="Department:"
                    value={app.department}
                    searchTerm={searchTerm}
                  />
                  <DetailRow
                    label="Designation:"
                    value={app.designation}
                    searchTerm={searchTerm}
                  />
                  <DetailRow
                    label="Organization Address:"
                    value={app.organizationAddress}
                    searchTerm={searchTerm}
                  />
                  <DetailRow
                    label="Job Grade:"
                    value={app.jobGrade}
                    searchTerm={searchTerm}
                  />
                  <DetailRow label="Salary:" value={app.salary} isCurrency />

                  {app.loan_type === "Teacher" && (
                    <DetailRow
                      label="Institute Address:"
                      value={app.instituteAddress}
                      searchTerm={searchTerm}
                    />
                  )}

                  {(app.loan_type === "Private Job Holder" ||
                    app.loan_type === "Garments Job Holder") && (
                    <DetailRow
                      label="Company Address:"
                      value={app.companyAddress}
                      searchTerm={searchTerm}
                    />
                  )}
                </div>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactNo?.includes(searchTerm);
    const matchesFilter = filterType === "all" || app.loan_type === filterType;
    const matchesDate =
      !selectedDate ||
      new Date(app.createdAt).toISOString().split("T")[0] === selectedDate;
    return matchesSearch && matchesFilter && matchesDate;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Download PDF from backend endpoint
  const downloadPDF = async () => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/download?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to download PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loan_applications_${selectedDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error downloading PDF");
      console.error(err);
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <div className="header-content">
          <h1>Loan Applications Dashboard</h1>
          <p>Manage and review all loan applications</p>
        </div>
        <Button variant="danger" onClick={handleLogout} className="logout-btn">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Button>
      </div>

      <div className="control-panel">
        <div className="search-filter">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
          <div className="filter-dropdown">
            <i className="bi bi-funnel"></i>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="Govt. Employee">Government Employee</option>
              <option value="Private Job Holder">Private Job Holder</option>
              <option value="Doctor">Doctor</option>
              <option value="Garments Job Holder">Garments Job Holder</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
        </div>

        <div className="date-filter-section">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            aria-label="Select date for application filter"
          />
          <Button
            variant="success"
            onClick={downloadPDF}
            disabled={!selectedDate}
            className="download-btn"
          >
            <i className="bi bi-download"></i> Download PDF
          </Button>

          {selectedDate && (
            <div className="date-stat">
              <span className="date-stat-value">{dateFilteredCount}</span>
              <span className="date-stat-label">
                applications on {selectedDate}
              </span>
            </div>
          )}
        </div>

        <div className="stats-summary">
          <div className="stat-card">
            <span className="stat-value">{applications.length}</span>
            <span className="stat-label">Total Applications</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{filteredApplications.length}</span>
            <span className="stat-label">Filtered Results</span>
          </div>
        </div>
      </div>

      <div className="applications-table-container">
        <Table hover className="applications-table">
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
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <React.Fragment key={app.id}>
                  <tr className={openDetailsId === app.id ? "active-row" : ""}>
                    <td className="applicant-name">
                      {highlightSearchTerm(app.fullName || "-", searchTerm)}
                    </td>
                    <td>
                      {highlightSearchTerm(app.contactNo || "-", searchTerm)}
                    </td>
                    <td>{getLoanTypeBadge(app.loan_type)}</td>
                    <td className="amount-cell">
                      ৳
                      {app.requiredAmount != null
                        ? parseFloat(app.requiredAmount).toLocaleString()
                        : "-"}
                    </td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td>
                      <Button
                        variant={
                          openDetailsId === app.id
                            ? "primary"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() =>
                          setOpenDetailsId(
                            openDetailsId === app.id ? null : app.id
                          )
                        }
                        className="details-btn"
                      >
                        {openDetailsId === app.id ? (
                          <>
                            <i className="bi bi-chevron-up"></i> Hide
                          </>
                        ) : (
                          <>
                            <i className="bi bi-chevron-down"></i> View
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                  {openDetailsId === app.id && (
                    <tr className="details-row">
                      <td colSpan="6">{renderDetails(app)}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">
                  <div className="no-results-content">
                    <i className="bi bi-search"></i>
                    <h4>No applications found</h4>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPanel;
