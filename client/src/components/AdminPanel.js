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
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin");
          return;
        }

        const response = await axios.get(
          "https://api.loanconsultancybd.com/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setApplications(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Fetch error:", err);

        if (err.response) {
          // Server responded with error status
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/admin");
            return;
          }
          setError(err.response.data?.error || "Server error occurred");
        } else if (err.request) {
          // Request was made but no response
          setError("Network error - please check your connection");
        } else {
          // Other errors
          setError(err.message || "Failed to fetch applications");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);
  useEffect(() => {
    if (selectedDate) {
      const filtered = applications.filter((app) => {
        const appDate = new Date(app.createdAt);
        const appUTCDate = new Date(
          Date.UTC(appDate.getFullYear(), appDate.getMonth(), appDate.getDate())
        );

        const filterDate = new Date(selectedDate);
        const filterUTCDate = new Date(
          Date.UTC(
            filterDate.getFullYear(),
            filterDate.getMonth(),
            filterDate.getDate()
          )
        );

        return appUTCDate.getTime() === filterUTCDate.getTime();
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
    if (!chambersArray || chambersArray.length === 0) {
      return (
        <p className="adminPanel-noData">No chamber information available</p>
      );
    }

    return chambersArray.map((chamber, idx) => (
      <div key={idx} className="adminPanel-chamberCard">
        <h6>Chamber {idx + 1}</h6>
        <DetailRow
          label="Place Name:"
          value={chamber.chamberPlaceName}
          searchTerm={searchTerm}
        />
        <DetailRow
          label="Address:"
          value={chamber.chamberAddress}
          searchTerm={searchTerm}
        />
        <DetailRow
          label="Monthly Income:"
          value={chamber.monthlyIncome}
          isCurrency
        />
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
      <div className="adminPanel-detailRow">
        <span className="adminPanel-detailLabel">{label}</span>
        <span className="adminPanel-detailValue">
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
      app.chambers?.[doctorTypeKeyMap[app.doctorType]] || null;

    return (
      <Accordion className="adminPanel-detailsAccordion" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Application Details</Accordion.Header>
          <Accordion.Body>
            <div className="adminPanel-detailsGrid">
              <div className="adminPanel-detailGroup">
                <h5 className="adminPanel-detailGroupTitle">
                  Personal Information
                </h5>
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
              <div className="adminPanel-detailGroup">
                <h5 className="adminPanel-detailGroupTitle">
                  Financial Information
                </h5>
                {app.salaryType ? (
                  <>
                    <DetailRow
                      label="Salary Type:"
                      value={app.salaryType}
                      searchTerm={searchTerm}
                    />
                    {app.salaryType === "Bank Amount" && (
                      <DetailRow
                        label="Amount:"
                        value={app.bankAmount}
                        isCurrency
                      />
                    )}
                    {app.salaryType === "Cash Amount" && (
                      <DetailRow
                        label="Amount:"
                        value={app.cashAmount}
                        isCurrency
                      />
                    )}
                    {app.salaryType === "Bank & Cash Amount" && (
                      <DetailRow
                        label="Amount:"
                        value={app.bankAndCashAmount}
                        isCurrency
                      />
                    )}
                  </>
                ) : (
                  // For Govt Employees or when salaryType is not set
                  <>
                    {app.bankAmount > 0 && (
                      <DetailRow
                        label="Amount:"
                        value={app.bankAmount}
                        isCurrency
                      />
                    )}
                    {app.cashAmount > 0 && (
                      <DetailRow
                        label="Amount:"
                        value={app.cashAmount}
                        isCurrency
                      />
                    )}
                    {app.bankAndCashAmount > 0 && (
                      <DetailRow
                        label="Amount:"
                        value={app.bankAndCashAmount}
                        isCurrency
                      />
                    )}
                    {!app.salaryType &&
                      !app.bankAmount &&
                      !app.cashAmount &&
                      !app.bankAndCashAmount && (
                        <p className="adminPanel-noData">
                          No financial information available
                        </p>
                      )}
                  </>
                )}
              </div>
              {app.loanType === "Doctor" && (
                <div className="adminPanel-detailGroup">
                  <h5 className="adminPanel-detailGroupTitle">
                    Doctor Information
                  </h5>
                  <DetailRow
                    label="BMDC Age:"
                    value={app.bmdcAge}
                    searchTerm={searchTerm}
                  />
                  <DetailRow
                    label="Doctor Type:"
                    value={app.doctorType}
                    searchTerm={searchTerm}
                  />

                  {app.doctorType !== "Only Chamber" && (
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
                          label="Salary of Hospital:"
                          value={app.monthlySalaryFromHospital}
                          isCurrency
                        />
                      )}
                    </>
                  )}

                  {(app.doctorType === "Job Holder" ||
                    app.doctorType === "Only Chamber" ||
                    app.doctorType === "Job Holder & Chamber") && (
                    <div className="adminPanel-chamberSection">
                      <h6 className="adminPanel-chamberSectionTitle">
                        Chamber Information
                      </h6>
                      {app.chambers &&
                        app.chambers[doctorTypeKeyMap[app.doctorType]] &&
                        renderChambers(
                          app.chambers[doctorTypeKeyMap[app.doctorType]]
                        )}
                    </div>
                  )}
                </div>
              )}
              {app.loanType !== "Doctor" && (
                <div className="adminPanel-detailGroup">
                  <h5 className="adminPanel-detailGroupTitle">
                    Employment Information
                  </h5>
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

                  {app.loanType === "Teacher" && (
                    <DetailRow
                      label="Institute Address:"
                      value={app.instituteAddress}
                      searchTerm={searchTerm}
                    />
                  )}

                  {(app.loanType === "Private Job Holder" ||
                    app.loanType === "Garments Job Holder") && (
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
    const matchesSearch = searchTerm
      ? app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contactNo?.includes(searchTerm)
      : true;

    const matchesFilter = filterType === "all" || app.loanType === filterType;

    const matchesDate = selectedDate
      ? new Date(app.createdAt).toISOString().split("T")[0] === selectedDate
      : true;

    return matchesSearch && matchesFilter && matchesDate;
  });

  if (loading) {
    return (
      <div className="adminPanel-loadingContainer">
        <div className="adminPanel-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return <div className="adminPanel-errorMessage">{error}</div>;
  }
  const downloadPDF = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin");
      return;
    }

    setIsDownloading(true);

    try {
      const params = new URLSearchParams();

      // Format date as YYYY-MM-DD if selected
      if (selectedDate) params.append("date", selectedDate);
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (filterType && filterType !== "all")
        params.append("filterType", filterType);

      const response = await fetch(
        `https://api.loanconsultancybd.com/api/applications/download?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      // Generate dynamic filename
      let filename = "loan_applications";
      if (selectedDate) filename += `_${selectedDate}`;
      if (filterType && filterType !== "all")
        filename += `_${filterType.replace(/\s+/g, "_")}`;
      if (searchTerm) filename += `_${searchTerm.substring(0, 10)}`;
      if (
        !selectedDate &&
        !searchTerm &&
        (!filterType || filterType === "all")
      ) {
        filename += "_ALL_DATA";
      }
      filename += ".pdf";

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      alert(`Download failed: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="adminPanel-container">
      <div className="adminPanel-header">
        <div className="adminPanel-headerContent">
          <h1>Loan Applications Dashboard</h1>
          <p>Manage and review all loan applications</p>
        </div>
        <Button
          variant="danger"
          onClick={handleLogout}
          className="adminPanel-logoutBtn"
        >
          <i className="bi bi-box-arrow-right"></i> Logout
        </Button>
      </div>

      <div className="adminPanel-controlPanel">
        <div className="adminPanel-searchFilter">
          <div className="adminPanel-searchBox">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="adminPanel-searchInput"
            />
            {searchTerm && (
              <button
                className="adminPanel-clearSearch"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
          <div className="adminPanel-filterDropdown">
            <i className="bi bi-funnel"></i>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="adminPanel-filterSelect"
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

        <div className="adminPanel-dateFilterSection">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="adminPanel-dateInput"
            aria-label="Select date for application filter"
          />
          <Button
            variant="success"
            onClick={downloadPDF}
            disabled={isDownloading || filteredApplications.length === 0}
            className="adminPanel-downloadBtn"
            title={
              `Download ${filteredApplications.length} records` +
              (selectedDate ? ` from ${selectedDate}` : "") +
              (filterType && filterType !== "all"
                ? ` of type ${filterType}`
                : "") +
              (searchTerm ? ` matching "${searchTerm}"` : "")
            }
          >
            {isDownloading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>{" "}
                Generating PDF...
              </>
            ) : (
              <>
                <i className="bi bi-download"></i>{" "}
                {filteredApplications.length > 0
                  ? `Download ${filteredApplications.length} Records`
                  : "Download"}
              </>
            )}
          </Button>
        </div>

        <div className="adminPanel-statsSummary">
          <div className="adminPanel-statCard">
            <span className="adminPanel-statValue">{applications.length}</span>
            <span className="adminPanel-statLabel">Total Applications</span>
          </div>
          <div className="adminPanel-statCard">
            <span className="adminPanel-statValue">
              {filteredApplications.length}
            </span>
            <span className="adminPanel-statLabel">Filtered Results</span>
          </div>
        </div>
      </div>

      <div className="adminPanel-applicationsTableContainer">
        <Table hover className="adminPanel-applicationsTable">
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
                  <tr
                    className={
                      openDetailsId === app.id ? "adminPanel-activeRow" : ""
                    }
                  >
                    <td className="adminPanel-applicantName">
                      {highlightSearchTerm(app.fullName || "-", searchTerm)}
                    </td>
                    <td>
                      {highlightSearchTerm(app.contactNo || "-", searchTerm)}
                    </td>
                    <td>{getLoanTypeBadge(app.loanType)}</td>
                    <td className="adminPanel-amountCell">
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
                        className="adminPanel-detailsBtn"
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
                    <tr className="adminPanel-detailsRow">
                      <td colSpan="6">{renderDetails(app)}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="adminPanel-noResults">
                  <div className="adminPanel-noResultsContent">
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
