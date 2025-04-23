import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Recdatabox from "../../components/Recdatabox/Recdatabox";
import Navbar from "../../components/Navbar/Navbar";

interface Course {
  _id: string;
  Title: string;
  Description: string;
  Category: string;
}

interface UserData {
  name: string;
  profilePicture?: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch courses
    fetch("http://localhost:5001/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Failed to fetch courses", err));

    // Verify user (optional: reuse auth context later)
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              profilePicture: data.decoded.profilePicture,
            });
          }
        })
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "40px" }}>
        {courses.map(course => (
          <div
            key={course._id}
            onClick={() => navigate(`/courses/${course._id}`)}
            style={{ cursor: "pointer" }}
          >
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
      </div>
    </div>
  );
};

export default Courses;