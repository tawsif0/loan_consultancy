// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ activeTab, scrollToSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "faq", label: "FAQ" }
  ];

  const handleApplyNow = () => {
    setMobileMenuOpen(false);
    navigate("/application");
  };

  return (
    <nav className={`navbar-section ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <span>Loan</span>Consult
          </div>

          <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                className={`nav-link ${activeTab === link.id ? "active" : ""}`}
                onClick={() => {
                  scrollToSection(link.id);
                  setMobileMenuOpen(false);
                }}
                role="button"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile-only Apply Now button */}
            <button
              className="btn btn-primary apply-now-mobile"
              onClick={handleApplyNow}
            >
              Apply Now
            </button>
          </div>

          {/* Desktop-only Apply Now button */}
          <div className="navbar-contact d-none-mobile">
            <button className="btn btn-primary" onClick={handleApplyNow}>
              Apply Now
            </button>
          </div>

          {/* Hamburger icon */}
          <div
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
