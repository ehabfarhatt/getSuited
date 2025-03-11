import React from "react";
import "./LandingPage.css";
import Navbar from "../../components/Navbar/Navbar"; 
// Adjust the import path as needed

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Navigation Bar at the top */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to getSuited!</h1>
        <p className="hero-tagline">
          Bridge the gap between academic knowledge and real-world career demands.
          Level up your skills, practice interviews, and launch your dream career.
        </p>

        <div className="hero-buttons">
          <a href="/signup" className="cta-button">
            Get Started
          </a>
          <a href="/signin" className="secondary-link">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
