import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Recdatabox from "../../components/Recdatabox/Recdatabox";
import Navbar from "../../components/Navbar/Navbar";
import "./Courses.css"; // create this CSS if you don’t have one

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

const RegisterPromptModal: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Please Sign In or Register</h2>
      <p>You must be signed in to view courses.</p>
      <button className="modal-btn" onClick={onRedirect}>Go to Login</button>
    </div>
  </div>
);

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [step, setStep] = useState<'checking' | 'prompt' | 'allowed'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.status === 200) return res.json();
          throw new Error('Unauthorized');
        })
        .then(data => {
          if (data?.decoded) {
            setUser({
              name: data.decoded.name,
              profilePicture: data.decoded.profilePicture,
            });
            setStep('allowed');

            fetch("http://localhost:5001/courses")
              .then(res => res.json())
              .then(data => setCourses(data))
              .catch(err => console.error("Failed to fetch courses", err));
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setStep('prompt');
        });
    } else {
      setStep('prompt');
    }
  }, []);

  return (
    <div className="courses-page">
      <Navbar user={user} />
      
      {step === 'prompt' && (
        <RegisterPromptModal onRedirect={() => navigate('/signin')} />
      )}

      {step === 'allowed' && (
        <div className="courses-container">
          <h1 className="courses-heading">Featured Courses</h1>
          <div className="horizontal-courses-scroll">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
