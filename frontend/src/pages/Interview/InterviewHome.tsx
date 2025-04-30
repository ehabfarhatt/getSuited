import React, { useState } from 'react';
import DisclaimerModal from '../../components/Interview/DisclaimerModal';
import InterviewSetupForm from '../../components/Interview/InterviewSetupForm';
import StartInterview from '../../components/Interview/StartInterview';

interface InterviewDetails {
    position: string;
    workType: string;
    seniority: string;
    companyName: string;
    workModel: string;
  }
  
const InterviewHome: React.FC = () => {
  const [step, setStep] = useState<'disclaimer' | 'position' | 'start'>('disclaimer');
  const [position, setPosition] = useState<string>('');
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);

  const handleAcceptDisclaimer = () => {
    setStep('position');
  };

  const handlePositionSelect = (selectedPosition: string) => {
    setPosition(selectedPosition);
    setStep('start');
  };

  const handleCompleteSetup = (details: InterviewDetails) => {
    setInterviewDetails(details); // Save all
    setStep('start');
  };

  return (
    <div>
      {step === 'disclaimer' && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
      {step === 'position' && <InterviewSetupForm onComplete={handleCompleteSetup} />}
      {step === 'start' && interviewDetails && (
        <StartInterview interviewDetails={interviewDetails} />
      )}
    </div>
  );
};

export default InterviewHome;