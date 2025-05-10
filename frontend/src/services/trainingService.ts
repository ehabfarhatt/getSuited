import axios from 'axios';

export const fetchCareerAdvice = async (userMessage: string) => {
  try {
    const response = await axios.post('http://localhost:5001/api/training/chat', { prompt: userMessage });
    return response.data.text || 'Sorry, I didn\'t catch that. Could you please ask about career-related topics?';
  } catch (error) {
    console.error('Error fetching career advice:', error);
    throw new Error('Failed to get career advice.');
  }
};