import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Navbar from "../../components/Navbar/Navbar";
import Recdatabox from "../../components/Recdatabox/Recdatabox";
import SliderBar from "../../components/SlideBar/SliderBar";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

interface UserData {
  name: string;
  profilePicture?: string;
}

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

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

    fetch("http://localhost:5001/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.slice(0, 10)))
      .catch((err) => console.error("Failed to fetch courses", err));
  }, []);

  return (
    <div className="landing-container">
      <Navbar user={user} />

      {/* Announcement Image Slider */}
      <div className="announcement-slider">
        <ImageSlider
          images={[
            {
              src: require("../../assets/codeBack.jpg"),
              heading: "Ready to Take an Interview?",
              buttonText: "Start Interview",
              link: "/interview",
            },
            {
              src: require("../../assets/codingLaptop.jpg"),
              heading: "Train with our AI Chatbot!",
              buttonText: "Take me!",
              link: "/training",
            },
          ]}
        />
      </div>

      <div className="landing-body">
        {/* Featured Courses */}
        <div className="section">
          <h2>Featured Courses</h2>
          <SliderBar>
            <div className="course-slider-wrapper">
              {courses.map((course, i) => (
                <div
                  key={course._id}
                  className="recdatabox fade-in"
                  onClick={() => navigate(`/courses/${course._id}`)}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="recdatabox-content">
                    <h3>{course.Title}</h3>
                    <p className="recdatabox-description">{course.Description}</p>
                    <div className="recdatabox-meta">
                      <span className="label">Category:</span>
                      <span className="value">{course.Category}</span>
                    </div>
                  </div>
                  <div className="recdatabox-footer">View Course →</div>
                </div>
              ))}
            </div>
          </SliderBar>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="see-all-btn" onClick={() => navigate("/courses")}>See All</button>
          </div>
        </div>

        {/* Interview Section */}
        <div className="section">
          <h2>Interview Practice</h2>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="see-all-btn" onClick={() => navigate("/interview")}>
              Take an Interview
            </button>
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="section">
          <h2>Questionnaire</h2>
          <SliderBar>
            <div className="questionnaire-slider-wrapper">
              <Recdatabox header="Skill Assessment" data={[{ label: "Level", value: "Beginner" }]} footerText="Take Test" footerLink="/questionnaire" />
            </div>
          </SliderBar>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;