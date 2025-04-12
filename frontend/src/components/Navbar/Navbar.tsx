import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

interface UserData {
  name: string;
  profilePicture?: string;
}

interface NavbarProps {
  user: UserData | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const navigate = useNavigate();

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
        {user ? (
          <button
            className="profile-button"
            onClick={() => navigate("/profile")}
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="profile"
                className="profile-picture"
              />
            ) : (
              <div className="default-profile-icon">👤</div>
            )}
            <span className="profile-name">{user.name}</span>
          </button>
        ) : (
          <Link to="/signup" className="cta-button">Register Now →</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;