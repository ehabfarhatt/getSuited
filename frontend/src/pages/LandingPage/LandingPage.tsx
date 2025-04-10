import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  profilePicture?: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              profilePicture: data.decoded.profilePicture,
            });
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <div className="landing-container">
      <Navbar />

      <div className="hero-section">
        <h1>Welcome to getSuited!</h1>
        <p className="hero-tagline">
          Bridge the gap between academic knowledge and real-world career demands.
          Level up your skills, practice interviews, and launch your dream career.
        </p>

        <div className="hero-buttons">
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
            <>
              <a href="/signup" className="cta-button">
                Register Now
              </a>
              <a href="/signin" className="secondary-link">
                Already have an account? Sign in
              </a>
            </>
          )}
        </div>

        {/* Features Section Below */}
        <div className="features-section">
          <h2>Explore Our Platform</h2>
          <ul className="feature-list">
            <li>📚 Personalized Courses</li>
            <li>🧠 AI Interview Practice</li>
            <li>📝 Behavioral Training</li>
            <li>📊 Progress Tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;