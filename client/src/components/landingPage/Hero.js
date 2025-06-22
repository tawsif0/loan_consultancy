// src/components/Hero.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = ({ scrollToSection }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(500000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(8.5);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    return isNaN(emi) ? 0 : emi.toFixed(0);
  };

  const totalPayment = (calculateEMI() * tenure).toFixed(0);
  const totalInterest = (totalPayment - amount).toFixed(0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container container my-5">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-heading">
              <span className="hero-heading-line">Smart Loan Solutions</span>
              <span className="hero-heading-line">
                for <span className="hero-heading-highlight">Your Future</span>
              </span>
            </h1>
            <p className="hero-description">
              Easily calculate your perfect loan plan. We help government
              employees, private job holders, teachers, doctors, and garment
              workers get personal loans with special benefits.
            </p>
            <div className="hero-actions">
              <button
                className="hero-btn hero-btn-primary"
                onClick={() => scrollToSection("services")}
              >
                <span>Our Services</span>
                <i className="fas fa-arrow-right"></i>
              </button>
              <button
                className="hero-btn hero-btn-secondary"
                onClick={() => navigate("/application")}
              >
                <span>Book for Loan Consultation</span>
                <i className="fas fa-bolt"></i>
              </button>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <i className="fas fa-check-circle"></i>
                <span>Free Consultation</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-check-circle"></i>
                <span>Colaboration with Banks</span>
              </div>
              <div className="hero-feature">
                <i className="fas fa-check-circle"></i>
                <span>No Transactions with Us</span>
              </div>
            </div>
          </div>

          <div className="hero-calculator-wrapper">
            <div className="hero-calculator">
              <div className="hero-calculator-header">
                <div className="hero-calculator-icon">
                  <i className="fas fa-calculator"></i>
                </div>
                <div>
                  <h3>Loan Calculator</h3>
                  <p className="hero-calculator-subtitle">
                    Find your perfect loan plan
                  </p>
                </div>
              </div>

              <div className="hero-calculator-control">
                <label>
                  <i className="fas fa-money-bill-wave"></i> Loan Amount (৳)
                </label>
                <div className="hero-input-group">
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="hero-range-input"
                  />
                  <div className="hero-input-wrapper">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="hero-number-input"
                    />
                  </div>
                </div>
                <div className="hero-amount-range">
                  <span>৳50K</span>
                  <span>৳50 Lakh</span>
                </div>
              </div>

              <div className="hero-calculator-control">
                <label>
                  <i className="fas fa-calendar-alt"></i> Tenure (Months)
                </label>
                <div className="hero-input-group">
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="hero-range-input"
                  />
                  <div className="hero-input-wrapper">
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      className="hero-number-input"
                    />
                  </div>
                </div>
                <div className="hero-amount-range">
                  <span>6 months</span>
                  <span>60 months</span>
                </div>
              </div>

              <div className="hero-calculator-control">
                <label>
                  <i className="fas fa-percent"></i> Interest Rate (%)
                </label>
                <div className="hero-input-group">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="hero-range-input"
                  />
                  <div className="hero-input-wrapper">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="hero-number-input"
                    />
                  </div>
                </div>
                <div className="hero-amount-range">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              <div className="hero-calculator-results">
                <div className="hero-result-item">
                  <div className="hero-result-icon">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <span>Monthly EMI</span>
                  <h4>৳{formatCurrency(calculateEMI())}</h4>
                </div>
                <div className="hero-result-item">
                  <div className="hero-result-icon">
                    <i className="fas fa-coins"></i>
                  </div>
                  <span>Total Interest</span>
                  <h4>৳{formatCurrency(totalInterest)}</h4>
                </div>
                <div className="hero-result-item">
                  <div className="hero-result-icon">
                    <i className="fas fa-hand-holding-usd"></i>
                  </div>
                  <span>Total Payment</span>
                  <h4>৳{formatCurrency(totalPayment)}</h4>
                </div>
              </div>
            </div>

            <div className="hero-shapes">
              <div className="hero-shape-1"></div>
              <div className="hero-shape-2"></div>
              <div className="hero-shape-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
