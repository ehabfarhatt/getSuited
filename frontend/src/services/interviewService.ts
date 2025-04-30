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