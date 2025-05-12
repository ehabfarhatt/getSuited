// src/pages/CourseDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./CourseDetails.css";

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
  youtubeUrl?: string;
  bookLink?: string;
  content?: string;
}

export default function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);

  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5001/courses/${courseId}`)
      .then((res) => res.json())
      .then((data: Course) => setCourse(data))
      .catch((err) => console.error("Failed to fetch course", err));
  }, [courseId]);

  if (!course) return <div className="loading">Loading…</div>;

  return (
    <>
      <Navbar />

      <div className="course-page">
        <button className="back-button" onClick={() => navigate("/courses")}>
          ← Go Back to Courses
        </button>

        <header className="course-hero">
          <h1 className="course-title">{course.Title}</h1>
          <p className="course-meta">
            <span className="category">{course.Category}</span>
            <span className="description">{course.Description}</span>
          </p>
        </header>

        <div className="course-container">
          {/* Main content first */}
          <main className="course-main">
            {course.youtubeUrl && (
              <section id="video-section" className="video-wrapper">
                <iframe
                  src={getEmbedUrl(course.youtubeUrl)}
                  title="Course Preview"
                  frameBorder="0"
                  allowFullScreen
                />
              </section>
            )}

            {course.content && (
              <section id="overview-section" className="course-overview">
                <h2>Course Overview</h2>
                <p>{course.content}</p>
              </section>
            )}

            {course.bookLink && (
              <section id="book-section" className="course-book">
                <h2>Course Book</h2>
                <a
                  href={course.bookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-button"
                >
                  View Book
                </a>
              </section>
            )}
          </main>

          {/* Sidebar on the right */}
          <aside className="course-sidebar">
            <nav className="sidebar-nav">
              <a href="#video-section" className="sidebar-link">
                Video Preview
              </a>
              <a href="#overview-section" className="sidebar-link">
                Course Content
              </a>
              <a href="#book-section" className="sidebar-link">
                Course Book
              </a>
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}
