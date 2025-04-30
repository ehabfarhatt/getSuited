import React, { useState } from 'react';

interface InterviewDetails {
  position: string;
  workType: string;
  seniority: string;
  companyName: string;
  workModel: string;
}

interface InterviewSetupFormProps {
  onComplete: (details: InterviewDetails) => void;
}

const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({ onComplete }) => {
  const [details, setDetails] = useState<InterviewDetails>({
    position: '',
    workType: '',
    seniority: '',
    companyName: '',
    workModel: '',
  });

  const handleChange = (field: keyof InterviewDetails, value: string) => {
    setDetails({ ...details, [field]: value });
  };

  const handleSubmit = () => {
    if (!details.position || !details.workType || !details.seniority || !details.companyName || !details.workModel) {
      alert('Please complete all fields before starting.');
      return;
    }
    onComplete(details); // Pass collected details to parent
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Interview Setup</h2>

        {/* Position */}
        <label className="block mb-2 font-semibold">Position</label>
        <select
          className="border border-gray-300 rounded-xl w-full p-2 mb-4"
          value={details.position}
          onChange={(e) => handleChange('position', e.target.value)}
        >
          <option value="">Select a Position</option>
          {['Software Engineer', 'Backend Developer', 'Frontend Designer', 'Full Stack Developer', 'Data Engineer', 'AI/ML Engineer', 'Cybersecurity Specialist', 'Database Administrator', 'Mobile App Developer', 'DevOps Engineer'].map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>

        {/* Work Type */}
        <label className="block mb-2 font-semibold">Work Type</label>
        <select
          className="border border-gray-300 rounded-xl w-full p-2 mb-4"
          value={details.workType}
          onChange={(e) => handleChange('workType', e.target.value)}
        >
          <option value="">Select Work Type</option>
          {['Internship', 'Full-Time', 'Part-Time'].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Seniority */}
        <label className="block mb-2 font-semibold">Seniority Level</label>
        <select
          className="border border-gray-300 rounded-xl w-full p-2 mb-4"
          value={details.seniority}
          onChange={(e) => handleChange('seniority', e.target.value)}
        >
          <option value="">Select Seniority</option>
          {['Junior', 'Mid-Level', 'Senior'].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        {/* Company Name */}
        <label className="block mb-2 font-semibold">Company Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded-xl w-full p-2 mb-4"
          placeholder="Enter Company Name"
          value={details.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
        />

        {/* Work Model */}
        <label className="block mb-2 font-semibold">Work Model</label>
        <select
          className="border border-gray-300 rounded-xl w-full p-2 mb-6"
          value={details.workModel}
          onChange={(e) => handleChange('workModel', e.target.value)}
        >
          <option value="">Select Work Model</option>
          {['Remote', 'Onsite', 'Hybrid'].map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-bold text-lg"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewSetupForm;