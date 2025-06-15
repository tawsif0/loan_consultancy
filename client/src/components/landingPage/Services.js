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
      title: "Government Employees",
      description:
        "Tailored personal loan solutions for government service holders in Bangladesh.",
      features: [
        "Low interest rates",
        "Flexible repayment terms",
        "Minimal documentation",
        "Quick approval",
      ],
      image: govLoanImg,
      icon: "fa-landmark",
    },
    {
      title: "Private Job Holders",
      description: "Designed for professionals working in the private sector.",
      features: [
        "Special bank offers for corporate employees",
        "Easy eligibility checks",
        "Fast processing time",
        "Personalized loan amount estimation",
      ],
      image: privateLoanImg,
      icon: "fa-briefcase",
    },
    {
      title: "Doctors",
      description: "Priority personal loan services for medical professionals.",
      features: [
        "High loan approval rates",
        "Special terms for MBBS/BDS/FCPS holders",
        "Higher loan limits",
        "Faster disbursement",
      ],
      image: doctorLoanImg,
      icon: "fa-user-md",
    },
    {
      title: "Garment Sector Workers",
      description:
        "Helping garment sector workers access simple and secure personal loans.",
      features: [
        "Loans for mid to higher income garment workers",
        "Smooth and hassle-free application process",
        "Affordable monthly installments",
        "Support for first-time borrowers",
      ],
      image: garmentsLoanImg,
      icon: "fa-tshirt",
    },
    {
      title: "Teachers",
      description:
        "Loan solutions specially designed for school, college, and university teachers.",
      features: [
        "Loans for both public and private institution teachers",
        "Easy eligibility verification",
        "Low EMIs for peace of mind",
        "Assistance throughout the process",
      ],
      image: teacherLoanImg,
      icon: "fa-chalkboard-teacher",
    },
  ];

  return (
    <section className="services-section section-padding" id="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          We specialize in personal loan consultancy for:
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
