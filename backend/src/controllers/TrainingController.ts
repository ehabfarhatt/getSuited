// import { controller, httpPost, request, response } from 'inversify-express-utils';
// import { Request, Response } from 'express';
// import axios from 'axios';

// @controller('/api/training')
// export class TrainingController {
//   @httpPost('/chat')
//   public async chat(@request() req: Request, @response() res: Response): Promise<void> {
//     try {
//       const { prompt } = req.body;

//       // Construct the prompt with career-specific instructions and limitations
//       const careerPrompt = `
// You are a career coach.

// The user has asked for advice or information related to job or career. Respond in a professional manner, providing advice and information that is directly relevant to job searching, career development, or professional growth.

// If the user asks anything unrelated to career matters, politely inform them that you are here to help with job and career-related topics only.

// User's query:
// ${prompt}

// Please respond as a helpful career coach, staying focused on job/career matters.
// `;

//       // Send the request to the AI model with the career-specific prompt
//       const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
//         model: 'llama3-70b-8192',
//         messages: [
//           { role: 'system', content: 'You are a professional career coach.' },
//           { role: 'user', content: careerPrompt },
//         ],
//         temperature: 0.7,
//         max_tokens: 500,
//       }, {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const generatedText = response.data.choices[0]?.message?.content;

//       if (!generatedText) {
//         res.status(500).json({ error: 'No response generated' });
//         return;
//       }

//       res.json({ text: generatedText });
//     } catch (error: any) {
//       console.error('Error with career chat:', error.response?.data || error.message);
//       res.status(500).json({ error: 'Failed to fetch career advice' });
//     }
//   }
// }
import { controller, httpPost, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import fetch from 'node-fetch';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
// In-memory store for transcripts; replace with persistent storage in production
const transcripts: Record<string, string> = {};

@controller('/api/training')
export class TrainingController {
  /**
   * Upload a PDF transcript or pass a URL for later analysis
   */
  @httpPost('/uploadTranscript', upload.single('transcript'))
public async uploadTranscript(@request() req: Request, @response() res: Response): Promise<void> {
  try {
    let text: string;

    if (req.file) {
      // ==== local PDF upload ====
      const buffer = fs.readFileSync(req.file.path);
      const parsed = await pdfParse(buffer);
      text = parsed.text;
      fs.unlinkSync(req.file.path);

    } else if (req.body.url) {
      // ==== remote PDF URL ====
      const pdfRes = await fetch(req.body.url);
      if (!pdfRes.ok) {
        res.status(400).json({ error: 'Could not download PDF from URL' });
        return;
      }
      const buffer = await pdfRes.buffer();
      const parsed = await pdfParse(buffer);
      text = parsed.text;

    } else {
      res.status(400).json({ error: 'No transcript provided' });
      return;
    }

    transcripts['default'] = text;          // store however you like
    res.json({ message: 'Transcript received and stored.' });

  } catch (err: any) {
    console.error('uploadTranscript error:', err);
    res.status(500).json({ error: 'Failed to process transcript' });
  }
}


  /**
   * Chat endpoint: integrates transcript (if any) and user prompt
   */
  @httpPost('/chat')
  public async chat(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { prompt, transcriptText } = req.body;
      // Fallback to stored transcript if none directly provided
      const textForAnalysis = transcriptText ?? transcripts['default'];

      // Build message history
      const messages: { role: string; content: string }[] = [
        { role: 'system', content: 'You are a professional career coach and interview evaluator.' }
      ];
      if (textForAnalysis) {
        messages.push({
          role: 'system',
          content: `Interview transcript for analysis:\n\n${textForAnalysis}`
        });
      }
      // User's actual query
      messages.push({
        role: 'user',
        content: `User's query: ${prompt}\nPlease respond as a helpful career coach, staying focused on job/career matters.`
      });

      // Send to AI
      const aiResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const generatedText = aiResponse.data.choices?.[0]?.message?.content;
      if (!generatedText) {
        res.status(500).json({ error: 'No response generated' });
        return;
      }
      res.json({ text: generatedText });
    } catch (err: any) {
      console.error('chat error:', err.response?.data || err.message);
      res.status(500).json({ error: 'Failed to fetch career advice' });
    }
  }
}