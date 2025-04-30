import React from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Interview Disclaimer</h2>
        <p className="text-gray-700 mb-6">
          This feature simulates a real interview experience. 
          Your camera and microphone will be used to analyze your responses, body language, and tone of voice.
          Your data will be handled securely and will not be shared.
        </p>
        <button 
          onClick={onAccept}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
        >
          I Agree, Proceed
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;