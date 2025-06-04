import React, { useState } from "react";
import "./Services.css";

// Importing images correctly from relative path
import govLoanImg from "../../assets/services/gov-loan.jpg";
import privateLoanImg from "../../assets/services/private-loan.jpg";
import doctorLoanImg from "../../assets/services/doctor-loan.jpg";
import garmentsLoanImg from "../../assets/services/garments-loan.jpg";
import teacherLoanImg from "../../assets/services/teacher-loan.jpg";

const Services = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Government Employee Loans",
      description:
        "Specialized loan solutions for government employees with competitive interest rates and flexible repayment options.",
      features: [
        "Low interest rates",
        "Flexible repayment terms",
        "Minimal documentation",
        "Quick approval"
      ],
      image: govLoanImg
    },
    {
      title: "Private Job Holder Loans",
      description:
        "Tailored loan options for private sector employees with stable income and employment history.",
      features: [
        "Competitive rates",
        "Customized EMI options",
        "Fast processing",
        "Minimal paperwork"
      ],
      image: privateLoanImg
    },
    {
      title: "Doctor Loans",
      description:
        "Special loan programs designed exclusively for medical professionals including job holders and chamber practitioners.",
      features: [
        "Higher loan amounts",
        "Special doctor categories",
        "Flexible repayment",
        "Quick disbursal"
      ],
      image: doctorLoanImg
    },
    {
      title: "Garments Job Holder Loans",
      description:
        "Customized financial solutions for employees in the garments industry with simplified eligibility criteria.",
      features: [
        "Easy eligibility",
        "Salary-based loans",
        "No collateral required",
        "Quick processing"
      ],
      image: garmentsLoanImg
    },
    {
      title: "Teacher Loans",
      description:
        "Education professional-focused loan programs with benefits tailored for teachers and academic staff.",
      features: [
        "Low processing fees",
        "Long tenure options",
        "Special discounts",
        "Easy documentation"
      ],
      image: teacherLoanImg
    }
  ];

  return (
    <section className="services-section section-padding" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          We specialize in providing loan consultancy for various professional
          groups
        </p>

        <div className="services-tabs">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-tab ${
                activeService === index ? "active" : ""
              }`}
              onClick={() => setActiveService(index)}
            >
              <div className="tab-icon">
                <i
                  className={`fas ${
                    index === 0
                      ? "fa-landmark"
                      : index === 1
                      ? "fa-briefcase"
                      : index === 2
                      ? "fa-user-md"
                      : index === 3
                      ? "fa-tshirt"
                      : "fa-chalkboard-teacher"
                  }`}
                ></i>
              </div>
              <h4>{service.title}</h4>
            </div>
          ))}
        </div>

        <div className="service-details">
          <div className="service-content">
            <h3>{services[activeService].title}</h3>
            <p>{services[activeService].description}</p>

            <div className="service-features">
              {services[activeService].features.map((feature, idx) => (
                <div key={idx} className="feature">
                  <i className="fas fa-check"></i>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="service-image">
            <div className="image-wrapper">
              <img
                src={services[activeService].image}
                alt={services[activeService].title}
                className="service-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
