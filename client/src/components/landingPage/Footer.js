// src/components/Footer.js
import React from "react";
import "./Footer.css";

const Footer = () => {
  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Left-aligned content, left positioned */}
          <div className="footer-about">
            <div className="footer-logo">
              <span>Loan</span>Consult
            </div>
            <p>
              Professional loan consultancy services helping individuals find
              the best financial solutions tailored to their needs.
            </p>
          </div>

          {/* Center aligned section, but text still left-aligned */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <button onClick={() => scrollToId("hero")}>Home</button>
              </li>
              <li>
                <button onClick={() => scrollToId("about")}>About Us</button>
              </li>
              <li>
                <button onClick={() => scrollToId("services")}>Services</button>
              </li>
              <li>
                <button onClick={() => scrollToId("faq")}>FAQ</button>
              </li>
            </ul>
          </div>

          {/* Right aligned section */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Financial Street, Business District</span>
              </li>
              <li>
                <i className="fas fa-phone-alt"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@loanconsult.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} LoanConsult. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
