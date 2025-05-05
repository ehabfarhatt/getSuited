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

const RegisterPromptModal: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '10px',
      textAlign: 'center',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    }}>
      <h2>Please Sign In or Register</h2>
      <p>You must be signed in to view courses.</p>
      <button
        onClick={onRedirect}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Login
      </button>
    </div>
  </div>
);

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [step, setStep] = useState<'checking' | 'prompt' | 'allowed'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    // Verify user (optional: reuse auth context later)
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div>
      {step === 'prompt' && (
        <RegisterPromptModal onRedirect={() => navigate('/signin')} />
      )}
  
      {step === 'allowed' && (
        <>
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
        </>
      )}
    </div>
  );
}

export default Courses;