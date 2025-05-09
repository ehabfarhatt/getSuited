import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface EvaluationResult {
  question: string;
  // For behavioral:
  audioBlob?: Blob;
  transcript?: string;
  confidence?: number;
  toneConfidence?: number;
  bodyLanguage?: {
    smilingScore: number;
    eyeContact: boolean;
    emotion: string;
  };
  // For technical:
  codeAnswer?: string;
  codeScore?: number;
  feedback?: string;
}

const EvaluationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Type-safe access
  const results = (location.state as { results: EvaluationResult[] })?.results;

  if (!results || !Array.isArray(results)) {
    // Invalid or missing results — redirect to home or show fallback
    navigate('/');
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Interview Evaluation</h1>
      <ul>
        {results.map((r, idx) => (
          <li key={idx} className="mb-6 p-4 border rounded shadow bg-white">
            <p><strong>Question:</strong> {r.question}</p>

            {/* TECHNICAL */}
            {r.codeAnswer && (
              <>
                <h3 className="text-lg font-semibold text-green-700 mt-4">Technical Response</h3>
                <p><strong>Code Answer:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{r.codeAnswer}</pre>
                <p><strong>Code Score:</strong> {r.codeScore ?? 0}/100</p>
                {r.feedback && (
                  <p><strong>Feedback:</strong> {r.feedback}</p>
                )}
              </>
            )}

            {/* BEHAVIORAL */}
            {r.transcript && (
              <>
                <h3 className="text-lg font-semibold text-blue-700 mt-4">Behavioral Response</h3>
                <p><strong>Transcript:</strong> {r.transcript}</p>
                <p><strong>Facial Confidence:</strong> {(r.confidence! * 100).toFixed(2)}%</p>
                  {r.toneConfidence !== undefined && (
                    <p><strong>Tone Confidence:</strong> {(r.toneConfidence * 100).toFixed(2)}%</p>
                  )}
                {r.bodyLanguage && (
                  <>
                    <p><strong>Emotion:</strong> {r.bodyLanguage.emotion}</p>
                    <p><strong>Smiling:</strong> {(r.bodyLanguage.smilingScore * 100).toFixed(1)}%</p>
                    <p><strong>Eye Contact:</strong> {r.bodyLanguage.eyeContact ? 'Yes' : 'No'}</p>
                    {r.toneConfidence !== undefined && r.confidence !== undefined && (
                    <p><strong>Overall Confidence:</strong> {(((r.toneConfidence + r.confidence) / 2) * 100).toFixed(2)}%</p>
                  )}
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationPage;