import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./components/ApplicationForm";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import LoanLandingPage from "./components/landingPage/LoanLandingPage";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LoanLandingPage />} />
          <Route path="/application" element={<ApplicationForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
