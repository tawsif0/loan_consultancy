// src/components/FAQ.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate(); // 🔹 Added navigation hook

  const faqs = [
    {
      question: "Is your loan consultancy service free?",
      answer:
        "Yes. We do not charge for consultation or guidance. Our goal is to help you get the right loan smoothly.",
    },
    {
      question: "Who can apply through your service?",
      answer:
        "We offer services mainly to salaried individuals: doctors, teachers, government and private employees, and garment sector professionals.",
    },
    {
      question: "How long does the loan approval process take?",
      answer:
        "Typically between 1 to 3 weeks, depending on your employment profile, bank procedures, and the completeness of your application.",
    },
    {
      question: "Do you handle or collect any money from clients?",
      answer:
        "No. We do not collect any fees or handle any financial transactions. All dealings happen directly between you and the bank.",
    },
    {
      question: "Can I still apply if I already have a loan?",
      answer:
        "Yes. Based on your current situation, we can assist with top-up or restructuring options, depending on bank policy.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleGetStarted = () => {
    navigate("/application"); // 🔹 Navigate to application page
  };

  return (
    <section className="faq-section section-padding" id="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          Find answers to common questions about our loan consultancy services
        </p>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <div className="faq-toggle">
                  <i
                    className={`fas ${
                      activeIndex === index ? "fa-minus" : "fa-plus"
                    }`}
                  ></i>
                </div>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
