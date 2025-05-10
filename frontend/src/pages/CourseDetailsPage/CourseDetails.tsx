import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import "./CourseDetails.css";

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5001/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error("Failed to fetch course", err));
  }, [courseId]);

  if (!course) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="course-details-layout">
        <LeftSideBar courseTitle={course.Title} />
        <div className="course-details-content">
          <h1 className="course-title">{course.Title}</h1>
          <p><strong>Description:</strong> {course.Description}</p>
          <p><strong>Category:</strong> {course.Category}</p>

          <div className="video-container" id="video">
            <iframe
              src="https://www.youtube.com/embed/kfcLqs1ISjk"
              title="Course Preview"
              allowFullScreen
            ></iframe>
          </div>

          <div className="course-extra-info" id="learn">
            <h3>What you'll learn</h3>
            <ul>
              <li>Understand SDLC and Agile methodologies</li>
              <li>Master Git and GitHub</li>
              <li>Build and test scalable software systems</li>
              <li>Learn software engineering best practices</li>
            </ul>

            <h3 id="contents">Course Contents</h3>
            <ol>
              <li>Intro to Software Engineering</li>
              <li>Agile vs Waterfall</li>
              <li>Git Basics</li>
              <li>Unit Testing</li>
              <li>Project Showcase</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetails;
