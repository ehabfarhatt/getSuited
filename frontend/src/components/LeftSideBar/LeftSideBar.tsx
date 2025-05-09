import React from "react";
import { Link } from "react-router-dom";
import "./LeftSideBar.css";


const LeftSideBar: React.FC = () => {
  return (
    <div className="left-sidebar">
      <div className="sidebar-logo">
        <h2>getSuited</h2>
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/courses">Courses</Link>
        </li>
        <li>
          <Link to="/interview">Interview</Link>
        </li>
        <li>
          <Link to="/training">Training</Link>
        </li>
        <li>
          <Link to="/questionnaire">Questionnaire</Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSideBar;