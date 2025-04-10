// pages/CourseDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export {}; // ensures it's treated as a module
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
    <div style={{ padding: "40px" }}>
      <h1>{course.Title}</h1>
      <p><strong>Description:</strong> {course.Description}</p>
      <p><strong>Category:</strong> {course.Category}</p>
    </div>
  );
};

export default CourseDetails;