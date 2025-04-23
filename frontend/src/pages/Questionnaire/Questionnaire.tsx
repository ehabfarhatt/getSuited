import React, { useState } from "react";
import "./Questionnaire.css";
import Navbar from "../../components/Navbar/Navbar";
import DataBox from "../../components/Databox/Databox";

interface UserData {
  name: string;
  profilePicture?: string;
}

const Questionnaire: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);

  const majors = [
    "Data Engineer",
    "Software Engineer",
    "App/Web Developer",
    "Artificial Intelligence",
    "Cybersecurity",
  ];

  const handleMajorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMajor(event.target.value);
  };

  return (
    <div className="questionnaire-container">
      {/* Navigation Bar at the top */}
      <Navbar user={user} />

      {/* Main Questionnaire Section */}
      <div className="questionnaire-content">
        <h1>Select Your Major</h1>
        <p>Choose a field of study to tailor your experience:</p>

        {/* Dropdown for selecting major */}
        <select onChange={handleMajorSelect} value={selectedMajor} className="dropdown">
          <option value="">-- Select a Major --</option>
          {majors.map((major, index) => (
            <option key={index} value={major}>
              {major}
            </option>
          ))}
        </select>

        {/* Display DataBox if a major is selected */}
        {selectedMajor && (
          <DataBox
            header={`Information for ${selectedMajor}`}
            data={[
              { label: "Course Recommendations", value: 5 },
              { label: "Industry Demand Score", value: 8.9 },
              { label: "Average Salary", value: "$90,000" },
            ]}
            footerText="Learn More"
            footerLink={`/career-path/${selectedMajor.toLowerCase().replace(/\s/g, "-")}`}
          />
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
