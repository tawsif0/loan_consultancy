// src/components/Hero.js
import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import "./Hero.css";

const Hero = ({ scrollToSection }) => {
  const navigate = useNavigate(); // 👈 initialize navigation

  return (
    <section className="hero-section" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Expert Loan Solutions for <span>Your Financial Needs</span>
            </h1>
            <p className="hero-subtitle">
              Free consultancy with no hidden fees. We help government
              employees, private job holders, doctors, teachers, and more secure
              the best loan options.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => scrollToSection("services")}
              >
                Explore Services
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/application")} // 👈 redirect on click
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-card">
              <div className="card-content">
                <div className="card-icon">
                  <i className="fas fa-hand-holding-usd"></i>
                </div>
                <h3>Free Consultancy</h3>
                <p>No personal transaction with us</p>
              </div>
            </div>
            <div className="hero-shape"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
