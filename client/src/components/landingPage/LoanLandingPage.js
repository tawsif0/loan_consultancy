// src/components/LoanLandingPage.js
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import FAQ from "./FAQ";
import Footer from "./Footer";
import "./LoanLandingPage.css";

const LoanLandingPage = () => {
  const [activeTab, setActiveTab] = useState("hero");

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveTab(sectionId);
    }
  };

  // Automatically detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "services", "faq"];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="loan-landing-page">
      <Navbar activeTab={activeTab} scrollToSection={scrollToSection} />

      <div id="hero">
        <Hero scrollToSection={() => scrollToSection("services")} />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="services">
        <Services />
      </div>

      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </div>
  );
};

export default LoanLandingPage;
