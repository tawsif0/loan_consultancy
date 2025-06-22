// src/components/About.js
import React from "react";
import "./About.css";
import handshakeImg from "../../assets/services/handshake.png"; // ✅ Import image

const About = () => {
  return (
    <section className="about-section section-padding" id="about">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <p className="section-subtitle">
          We provide expert personal loan guidance to salaried individuals
          across Bangladesh
        </p>

        <div className="about-content">
          <div className="about-image">
            <div className="image-container">
              {/* ✅ Use <img> for better responsiveness */}
              <img src={handshakeImg} alt="Handshake" className="main-image" />
              <div className="shape-1"></div>
              <div className="shape-2"></div>
            </div>
          </div>

          <div className="about-text">
            <h3>Our Mission</h3>
            <p>
              To help professionals in Bangladesh gain access to affordable and
              reliable personal loans, while ensuring clarity, transparency, and
              peace of mind.
            </p>

            <h3>Why Choose Us</h3>
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>7+ Years Experience</h4>
                  <p>Extensive consultancy experience in the industry</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Free Consultation</h4>
                  <p>No charges for our expert advice and guidance</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>No Client Funds Handling</h4>
                  <p>We never collect or handle client funds</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Bank-Trusted Guidance</h4>
                  <p>
                    Professional advice recognized by financial institutions
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Proven Track Record</h4>
                  <p>Professional team with successful history</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Confidential Process</h4>
                  <p>Fully secure and private service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
