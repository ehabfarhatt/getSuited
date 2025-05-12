import { controller, httpPost, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../config/types';
import fs from 'fs';
import EmailService from '../services/emailService';  // Correct import of EmailService

// Multer configuration for handling file uploads
import multer from 'multer';

// Configure multer to store uploaded files in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

@controller('/sendEmail')
export default class EmailController {
  constructor(@inject(TYPES.EmailService) private emailService: EmailService) {}

  @httpPost('/', upload.single('file'))  // Use multer middleware to handle file uploads
  async sendEmail(@request() req: Request, @response() res: Response) {
    try {
      const { email } = req.body;  // Get the email from the request body
      const file = req.file;  // The uploaded file

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Send the email with the attached PDF file
      const filePath = file.path;  // File path where the PDF is temporarily stored
      const result = await this.emailService.sendEmail(email, filePath);  // Pass the file path to EmailService

      // Clean up the file after sending the email
      fs.unlinkSync(filePath);  // Remove the file after sending email

      res.status(200).json({ message: 'Email sent successfully', result });
    } catch (error) {
      console.error('Error in sendEmail controller:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  }
}