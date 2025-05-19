import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

/**
 * Send user message and optional transcript for analysis
 */
export const fetchCareerAdvice = async (
  userMessage: string,
  transcriptText?: string
): Promise<string> => {
  try {
    const payload: any = { prompt: userMessage };
    if (transcriptText) payload.transcriptText = transcriptText;

    const response = await axios.post(
      `${API_BASE}/training/chat`,
      payload,
    );

    return (
      response.data.text ||
      "Sorry, I didn't catch that. Could you please ask about career-related topics?"
    );
  } catch (error) {
    console.error('Error fetching career advice:', error);
    throw new Error('Failed to get career advice.');
  }
};

/**
 * Upload a new interview transcript PDF for analysis
 */
export const uploadInterviewTranscript = async (
  file: File | { url: string }
): Promise<void> => {
  if ('url' in file) {
    // For existing URL-based transcripts
    await axios.post(
      `${API_BASE}/training/uploadTranscript`,
      { url: file.url },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    // Upload File
    const form = new FormData();
    form.append('transcript', file as File);
    await axios.post(
      `${API_BASE}/training/uploadTranscript`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
};

/**
 * Fetch list of user's saved evaluation transcripts
 */
export const fetchUserEvaluations = async (email: string) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(
      `http://localhost:5001/users/evaluations`,   // 👈 no /api
      {
        params: { email },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error fetching evaluations:', err);
    throw new Error('Failed to fetch evaluation reports.');
  }
};
