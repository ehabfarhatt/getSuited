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
  
  export const saveEvaluation = async (evaluationData: EvaluationResult[], userId: string) => {
    return fetch('/api/save-evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, evaluationData }),
    });
  };