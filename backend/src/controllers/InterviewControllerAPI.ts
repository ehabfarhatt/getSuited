import { controller, httpPost, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import axios from 'axios';

@controller('/api/interview')
export class InterviewController {
  @httpPost('/generate-questions')
  public async generateQuestions(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a professional technical recruiter.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedText = response.data.choices[0]?.message?.content;

      if (!generatedText) {
        res.status(500).json({ error: 'No questions generated' });
        return;
      }

      const questions = generatedText
        .split('\n')
        .map((q: string) => q.replace(/^\d+\.\s*/, '')) // clean numbering like "1. "
        .filter((q: string) => q.trim() !== '');

      res.json({ questions });
    } catch (error: any) {
      console.error('Error generating interview questions:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  }
}