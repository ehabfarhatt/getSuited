import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">getSuited</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/interview">Interview</Link></li>
        <li><Link to="/training">Training</Link></li>
        <li><Link to="/questionnaire">Questionnaire</Link></li>
      </ul>
      <div className="navbar-register">
        <Link to="/register">Register Now →</Link>
      </div>
    </nav>
  );
};

export default Navbar;