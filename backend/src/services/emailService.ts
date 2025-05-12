import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import fs from 'fs'; // Import fs module to read files
import 'reflect-metadata';

@injectable()
export default class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // Zoho SMTP server
      port: 587,              // TLS port
      secure: false,          // Use TLS, not SSL
      auth: {
        user: process.env.EMAIL_USER,  // Your Zoho email address
        pass: process.env.EMAIL_PASS,  // Your Zoho app password or email password
      },
    });
  }

  // Function to send email with PDF attachment
  public async sendEmail(recipientEmail: string, filePath: string): Promise<any> {
    // Read the PDF file into a Buffer
    const pdfBuffer = fs.readFileSync(filePath);

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender's Zoho email address
      to: recipientEmail,            // Receiver's email address (passed from frontend)
      subject: 'Interview Evaluation PDF',
      text: 'Please find attached the evaluation PDF for your interview.',
      attachments: [
        {
          filename: 'interview_evaluation.pdf',  // Name of the attached file
          content: pdfBuffer,   // Attach the PDF content as a Buffer
        },
      ],
    };

    try {
      // Send the email using the transporter
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);  // Log the response for debugging
      return info;
    } catch (error) {
      console.error('Error sending email:', error);  // Log any errors
      throw new Error('Email sending failed');
    }
  }
}