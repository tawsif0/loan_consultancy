// src/components/FAQ.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate(); // 🔹 Added navigation hook

  const faqs = [
    {
      question: "Is your loan consultancy service really free?",
      answer:
        "Yes, our consultancy service is completely free. We provide expert advice and guidance without any charges. We don't handle any transactions or take any fees for our consultation services."
    },
    {
      question: "Who can use your loan consultancy services?",
      answer:
        "Our services are available to government employees, private job holders, doctors (job holders, chamber practitioners, or both), garments job holders, and teachers. We provide specialized guidance for each profession."
    },
    {
      question: "How long does the loan approval process take?",
      answer:
        "The loan approval process varies depending on the type of loan and the financial institution. However, with our guidance, we can help expedite the process. Typically, it takes between 3 to 10 working days after submitting all required documents."
    },
    {
      question: "What documents are required for loan applications?",
      answer:
        "Document requirements vary by loan type and lender. Generally, you'll need proof of identity, address proof, income documents, employment verification, and bank statements. We provide a customized checklist based on your specific loan requirements."
    },
    {
      question: "Can you help with loan applications if I have existing loans?",
      answer:
        "Yes, we can assist you even if you have existing loans. We'll evaluate your current financial situation and help you find the best options that consider your existing liabilities. We provide guidance on debt consolidation options as well."
    }
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
