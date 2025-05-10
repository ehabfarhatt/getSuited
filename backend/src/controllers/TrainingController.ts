import { controller, httpPost, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import axios from 'axios';

@controller('/api/training')
export class TrainingController {
  @httpPost('/chat')
  public async chat(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      // Construct the prompt with career-specific instructions and limitations
      const careerPrompt = `
You are a career coach.

The user has asked for advice or information related to job or career. Respond in a professional manner, providing advice and information that is directly relevant to job searching, career development, or professional growth.

If the user asks anything unrelated to career matters, politely inform them that you are here to help with job and career-related topics only.

User's query:
${prompt}

Please respond as a helpful career coach, staying focused on job/career matters.
`;

      // Send the request to the AI model with the career-specific prompt
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a professional career coach.' },
          { role: 'user', content: careerPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedText = response.data.choices[0]?.message?.content;

      if (!generatedText) {
        res.status(500).json({ error: 'No response generated' });
        return;
      }

      res.json({ text: generatedText });
    } catch (error: any) {
      console.error('Error with career chat:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch career advice' });
    }
  }
}