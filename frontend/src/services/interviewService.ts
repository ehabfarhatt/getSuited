import axios from 'axios';

interface InterviewDetails {
  position: string;
  workType: string;
  seniority: string;
  companyName: string;
  workModel: string;
}

export const fetchInterviewQuestions = async (details: InterviewDetails) => {
  const prompt = `
You are an AI interview coach.

Generate exactly 5 interview questions only (no introduction, no headings, no question numbers, no labels like "Technical Skills" or "Soft Skills").

The candidate is applying for a ${details.workType} ${details.position} role at ${details.companyName}.
It is a ${details.seniority}-level, ${details.workModel} position.

Each question should be on a new line, and should evaluate both technical and soft skills.

Respond ONLY with the 5 questions as plain text.
`;

  const response = await axios.post('http://localhost:5001/api/interview/generate-questions', { prompt });
  return response.data;
};

export const fetchTechnicalQuestions = async (details: InterviewDetails) => {
  const prompt = `
You are a technical interviewer.

Generate exactly 5 coding interview questions ONLY for a ${details.workType} ${details.position} role at ${details.companyName}.
It is a ${details.seniority}-level, ${details.workModel} position.

Each question should be:
- Focused on coding or algorithmic challenges
- Presented on a single line (no numbering or headings)

Respond ONLY with the 5 questions as plain text, each on a new line.
`;

  const response = await axios.post('http://localhost:5001/api/interview/generate-questions', { prompt });
  return response.data;
};

export const evaluatePseudocode = async (question: string, answer: string) => {
    const prompt = `
You are a technical interviewer. The candidate answered the following technical question using pseudocode.

Question:
${question}

Pseudocode Answer:
${answer}

Evaluate only the logical correctness of the answer (not syntax or formatting).

Return your response in this strict format:
Score: <a number between 0 and 100>
Feedback: <brief feedback>
`;
  
    const res = await axios.post('http://localhost:5001/api/interview/evaluate', { prompt });
    const text = (res.data?.text || res.data)?.trim?.() || '';
    const scoreMatch = text.match(/Score:\s*(\d+)/i);
    const feedbackMatch = text.match(/Feedback:\s*(.*)/);
  
    return {
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
      feedback: feedbackMatch ? feedbackMatch[1].trim() : '',
    };
  };