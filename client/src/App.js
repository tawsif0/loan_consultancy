import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationForm from "./components/ApplicationForm";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<ApplicationForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
