import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

interface User {
  name: string;
  profilePicture?: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

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
      <div className="navbar-user-section">
        {user?.profilePicture ? (
          <>
            <Link to="/UserProfile">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="navbar-profile-pic"
              />
            </Link>
            <button className="signout-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <Link className="navbar-register-btn" to="/register">Register Now →</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
