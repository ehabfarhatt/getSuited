import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DisclaimerModal from '../../components/Interview/DisclaimerModal';
import InterviewSetupForm from '../../components/Interview/InterviewSetupForm';
import StartInterview from '../../components/Interview/BehavioralInterview';
import TechnicalInterview from '../../components/Interview/TechnicalInterview';
import { EvaluationResult, InterviewDetails } from '../../type/interview';

// Inline modal component
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
      <p>You must be signed in to take the interview.</p>
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

const InterviewHome: React.FC = () => {
  const [step, setStep] = useState<'registerCheck' | 'registerPrompt' | 'disclaimer' | 'position' | 'behavioral' | 'technical' | 'combined'>('registerCheck');
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const navigate = useNavigate();

  // Simple localStorage-based check
  const isUserRegistered = () => {
    const user = localStorage.getItem('user');
    return user !== null;
  };

  useEffect(() => {
    if (step === 'registerCheck') {
      if (isUserRegistered()) {
        setStep('disclaimer');
      } else {
        setStep('registerPrompt');
      }
    }
  }, [step]);

  const handleAcceptDisclaimer = () => {
    setStep('position');
  };

  const handleCompleteSetup = (details: InterviewDetails) => {
    setInterviewDetails(details);
    setStep('combined'); // Or 'behavioral' / 'technical'
  };

  const handleBehavioralComplete = (behavioralResults: EvaluationResult[]) => {
    setResults(behavioralResults);
    setStep('technical');
  };

  const handleTechnicalComplete = (technicalResults: EvaluationResult[]) => {
    const allResults = [...results, ...technicalResults];
    navigate('/evaluation', { state: { results: allResults } });
  };

  return (
    <div>
      {step === 'registerPrompt' && (
        <RegisterPromptModal onRedirect={() => navigate('/signin')} />
      )}
      {step === 'disclaimer' && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
      {step === 'position' && <InterviewSetupForm onComplete={handleCompleteSetup} />}
      {step === 'behavioral' && interviewDetails && (
        <StartInterview interviewDetails={interviewDetails} onInterviewComplete={handleBehavioralComplete} />
      )}
      {step === 'technical' && interviewDetails && (
        <TechnicalInterview interviewDetails={interviewDetails} onInterviewComplete={handleTechnicalComplete} />
      )}
      {step === 'combined' && interviewDetails && (
        <StartInterview interviewDetails={interviewDetails} onInterviewComplete={handleBehavioralComplete} />
      )}
    </div>
  );
};

export default InterviewHome;