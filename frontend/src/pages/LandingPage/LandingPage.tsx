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
        { src: "/images/slide1.jpg", link: "/announcement/1" },
        { src: "/images/slide2.jpg", link: "/announcement/2" },
        // Add more slides
      ]}
    />
  </div>

  <div className="landing-body">

    {/* Featured Courses */}
    <div className="section">
      <h2>Featured Courses</h2>
      <SliderBar>
        {courses.map(course => (
          <div key={course._id} onClick={() => navigate(`/courses/${course._id}`)}>
            <Recdatabox
              header={course.Title}
              data={[
                { label: "Description", value: course.Description },
                { label: "Category", value: course.Category },
              ]}
              footerText="View Course"
              footerLink="#"
            />
          </div>
        ))}
      </SliderBar>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button className="see-all-btn" onClick={() => navigate("/courses")}>
              See All
            </button>
          </div>
    </div>

    {/* Interview Section */}
    <div className="section">
      <h2>Interview Practice</h2>
      <SliderBar>
        <Recdatabox header="Technical Interview" data={[{ label: "Type", value: "Coding" }]} footerText="Start" footerLink="/interview/technical" />
        <Recdatabox header="Behavioral Interview" data={[{ label: "Type", value: "Soft Skills" }]} footerText="Start" footerLink="/interview/behavioral" />
      </SliderBar>
    </div>

    {/* Questionnaire Section */}
    <div className="section">
      <h2>Questionnaire</h2>
      <SliderBar>
        <Recdatabox header="Skill Assessment" data={[{ label: "Level", value: "Beginner" }]} footerText="Take Test" footerLink="/questionnaire" />
        {/* Add more boxes */}
      </SliderBar>
    </div>
  </div>

  
        </div>
  );
};

export default LandingPage;