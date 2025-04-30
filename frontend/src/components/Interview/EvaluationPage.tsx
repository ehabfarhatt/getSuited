type BodyLanguageMetrics = {
  smilingScore: number;
  eyeContact: boolean;
  emotion: string;
};

type EvaluationResult = {
  question: string;
  audioBlob: Blob;
  transcript: string;
  confidence: number;
  bodyLanguage?: BodyLanguageMetrics;
};

const EvaluationPage: React.FC<{ results: EvaluationResult[] }> = ({ results }) => {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Interview Evaluation Summary</h1>
        {results.map((res, i) => (
          <div key={i} className="bg-white p-4 shadow-md rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-2">Question {i + 1}</h2>
            <p className="mb-2"><strong>Transcript:</strong> {res.transcript}</p>
            <p className="mb-2"><strong>Confidence:</strong> {(res.confidence * 100).toFixed(1)}%</p>
            <p className="mb-2"><strong>Smile:</strong> {(res.bodyLanguage?.smilingScore || 0).toFixed(2)}</p>
            <p className="mb-2"><strong>Eye Contact:</strong> {res.bodyLanguage?.eyeContact ? 'Yes' : 'No'}</p>
            <p className="mb-2"><strong>Emotion Detected:</strong> {res.bodyLanguage?.emotion}</p>
          </div>
        ))}
      </div>
    );
  };