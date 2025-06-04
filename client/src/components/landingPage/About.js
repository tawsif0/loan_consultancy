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
          We provide specialized loan consultancy services tailored to your
          specific needs and employment type.
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
            <h3>Professional Loan Consultation Services</h3>
            <p>
              With over 15 years of experience in the financial industry, we've
              helped thousands of clients secure the best loan options tailored
              to their specific circumstances. Our expert consultants understand
              the unique requirements of different professions.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Free Consultation</h4>
                  <p>No fees for our expert advice and guidance</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>No Personal Transactions</h4>
                  <p>We don't handle your money, only provide guidance</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="feature-text">
                  <h4>Wide Range of Loan Types</h4>
                  <p>Specialized solutions for various professions</p>
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
