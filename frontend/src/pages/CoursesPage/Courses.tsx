// pages/Courses.tsx
import React, { useEffect, useState } from "react";
import Recdatabox from "../../components/Recdatabox/Recdatabox";
import { useNavigate } from "react-router-dom";

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/courses") // Adjust endpoint as needed
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Failed to fetch courses", err));
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "40px" }}>
            {courses.map(course => (
        <div key={course._id} onClick={() => navigate(`/courses/${course._id}`)} style={{ cursor: "pointer" }}>
            <Recdatabox
            header={course.Title} // Title with capital T
            data={[
                { label: "Description", value: course.Description },
                { label: "Category", value: course.Category },
            ]}
            footerText="View Course"
            footerLink="#"
            />
        </div>
        ))}
    </div>
  );
};

export default Courses;