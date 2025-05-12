import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import './EvaluationPage.css';

interface EvaluationResult {
  question: string;
  audioBlob?: Blob;
  transcript?: string;
  confidence?: number;
  toneConfidence?: number;
  bodyLanguage?: {
    smilingScore: number;
    eyeContact: boolean;
    emotion: string;
  };
  codeAnswer?: string;
  codeScore?: number;
  feedback?: string;
}

interface UserData {
  email: string;  // Added email field
  name: string;
  profilePicture?: string;
}

const EvaluationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null); // Added user state

  const results = (location.state as { results: EvaluationResult[] })?.results;

  // Fetch the logged-in user's info on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch("http://localhost:5001/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setUser({
            email: data.decoded.email,  // Save the user's email
            name: data.decoded.name,
            profilePicture: data.decoded.profilePicture,
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate('/');
        });
    }
  }, [navigate]);

  if (!results || !Array.isArray(results)) {
    navigate('/');
    return null;
  }

  // Function to generate and return the PDF as a Blob
const generatePDF = () => {
  const doc = new jsPDF();

  // Add the logo (if you have one)
  const logo = require("../../../assets/logo.png");  // Path to your logo
  const imgData = logo;  // Base64 string or image URL
  doc.addImage(imgData, 'PNG', 20, 10, 50, 20);  // Adding logo at (20,10) with size 50x20

  // Add title
  doc.setFontSize(16);
  doc.text('Interview Evaluation', 20, 40);

  let yOffset = 50;  // Starting position for the first item

  results.forEach((r, idx) => {
    doc.setFontSize(14);
    doc.text(`Question ${idx + 1}:`, 20, yOffset);
    yOffset += 10;  // Move down for question text
    doc.setFontSize(12);

    // Wrap the question text
    const questionLines = doc.splitTextToSize(r.question, 180);  // Wrap text within 180mm width
    doc.text(questionLines, 20, yOffset);
    yOffset += questionLines.length * 7;  // Adjust yOffset based on the number of lines

    // TECHNICAL
    if (r.codeAnswer) {
      doc.setFontSize(14);
      doc.text('Technical Response', 20, yOffset);
      yOffset += 10;  // Move down for response title
      doc.setFontSize(12);

      // Wrap the code answer text
      const codeAnswerLines = doc.splitTextToSize(r.codeAnswer, 180);
      doc.text(codeAnswerLines, 20, yOffset);
      yOffset += codeAnswerLines.length * 7;

      doc.text(`Code Score: ${r.codeScore ?? 0}/100`, 20, yOffset);
      yOffset += 10;

      if (r.feedback) {
        const feedbackLines = doc.splitTextToSize(r.feedback, 180);  // Wrap feedback text
        doc.text(feedbackLines, 20, yOffset);
        yOffset += feedbackLines.length * 7;
      }
    }

    // BEHAVIORAL
    if (r.transcript) {
      doc.setFontSize(14);
      doc.text('Behavioral Response', 20, yOffset);
      yOffset += 10;

      // Wrap the transcript text
      const transcriptLines = doc.splitTextToSize(r.transcript, 180);  // Wrap transcript text
      doc.text(transcriptLines, 20, yOffset);
      yOffset += transcriptLines.length * 7;

      doc.text(`Facial Confidence: ${(r.confidence! * 100).toFixed(2)}%`, 20, yOffset);
      yOffset += 10;

      if (r.toneConfidence !== undefined) {
        doc.text(`Tone Confidence: ${(r.toneConfidence * 100).toFixed(2)}%`, 20, yOffset);
        yOffset += 10;
      }

      if (r.bodyLanguage) {
        doc.text(`Emotion: ${r.bodyLanguage.emotion}`, 20, yOffset);
        yOffset += 10;

        doc.text(`Smiling: ${(r.bodyLanguage.smilingScore * 100).toFixed(1)}%`, 20, yOffset);
        yOffset += 10;

        doc.text(`Eye Contact: ${r.bodyLanguage.eyeContact ? 'Yes' : 'No'}`, 20, yOffset);
        yOffset += 10;

        if (r.toneConfidence !== undefined && r.confidence !== undefined) {
          doc.text(`Overall Confidence: ${(((r.toneConfidence + r.confidence) / 2) * 100).toFixed(2)}%`, 20, yOffset);
          yOffset += 10;
        }
      }
    }

    // Add extra space between questions for better readability
    yOffset += 20;

    // Prevent overflow if too much content
    if (yOffset > 270) {
      doc.addPage();  // Add a new page if content exceeds the page limit
      yOffset = 20;  // Reset yOffset for the new page
    }
  });

  // Return the PDF as a Blob
  return doc.output('blob');
};

  // Function to send the PDF via email
  const sendEmail = async () => {
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    const email = user.email;  // Get the email from the user state
    const formData = new FormData();
    
    // Generate the PDF as a Blob
    const pdfFile = generatePDF();

    // Append the PDF Blob to the FormData
    formData.append('file', pdfFile, 'interview_evaluation.pdf');
    formData.append('email', email); // Send user email to the backend

    // Send the form data to the backend endpoint for email sending
    fetch('http://localhost:5001/sendEmail', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Email sent successfully:', data);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div className="evaluation-page-container">
      <Navbar user={user} /> {/* Pass the user object to Navbar */}
      <div className="evaluation-content">
        <h1 className="evaluation-title">Interview Evaluation</h1>
        <ul>
          {results.map((r, idx) => (
            <li key={idx} className="evaluation-item">
              <p><strong>Question:</strong> {r.question}</p>
              {r.codeAnswer && (
                <>
                  <h3 className="section-title">Technical Response</h3>
                  <pre className="code-answer">{r.codeAnswer}</pre>
                  <p><strong>Code Score:</strong> {r.codeScore ?? 0}/100</p>
                  {r.feedback && <p><strong>Feedback:</strong> {r.feedback}</p>}
                </>
              )}
              {r.transcript && (
                <>
                  <h3 className="section-title">Behavioral Response</h3>
                  <p><strong>Transcript:</strong> {r.transcript}</p>
                  <p><strong>Facial Confidence:</strong> {(r.confidence! * 100).toFixed(2)}%</p>
                  {r.toneConfidence !== undefined && (
                    <p><strong>Tone Confidence:</strong> {(r.toneConfidence * 100).toFixed(2)}%</p>
                  )}
                  {r.bodyLanguage && (
                    <>
                      <p><strong>Emotion:</strong> {r.bodyLanguage.emotion}</p>
                      <p><strong>Smiling:</strong> {(r.bodyLanguage.smilingScore * 100).toFixed(1)}%</p>
                      <p><strong>Eye Contact:</strong> {r.bodyLanguage.eyeContact ? 'Yes' : 'No'}</p>
                      {r.toneConfidence !== undefined && r.confidence !== undefined && (
                        <p><strong>Overall Confidence:</strong> {(((r.toneConfidence + r.confidence) / 2) * 100).toFixed(2)}%</p>
                      )}
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="evaluation-buttons">
          <button className="generate-pdf-btn" onClick={generatePDF}>Download PDF</button>
          <button className="send-email-btn" onClick={sendEmail}>Send via Email</button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;