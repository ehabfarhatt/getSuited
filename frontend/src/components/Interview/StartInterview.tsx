import React, { useEffect, useState, useRef } from 'react';
import { fetchInterviewQuestions } from '../../services/interviewService';
import { analyzeAudioWithDeepgram } from '../../services/deepgramService';
import * as faceapi from 'face-api.js';

interface StartInterviewProps {
  interviewDetails: {
    position: string;
    workType: string;
    seniority: string;
    companyName: string;
    workModel: string;
  };
}

type EvaluationResult = {
  question: string;
  audioBlob: Blob;
  transcript: string;
  confidence: number;
  bodyLanguage?: BodyLanguageMetrics;
};

type BodyLanguageMetrics = {
    smilingScore: number; // 0 to 1
    eyeContact: boolean;
    emotion: string;
  };

const StartInterview: React.FC<StartInterviewProps> = ({ interviewDetails }) => {
  const [countdown, setCountdown] = useState(5);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [bodyLanguageResults, setBodyLanguageResults] = useState<BodyLanguageMetrics[]>([]);


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && modelsLoaded) {
      startInterview();
    }
  }, [countdown, modelsLoaded]);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
  
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
      console.log('✅ FaceAPI models fully loaded');
    };
  
    loadModels();
  }, []);

  const startInterview = async () => {
    // if (!modelsLoaded) {
    //   console.warn('⏳ Models not ready yet.');
    //   return;
    // }
  
    const res = await fetchInterviewQuestions(interviewDetails);
    setQuestions(res.questions);
  
    await startCamera(); // ensure camera loads before you start analyzing
    await startRecording();
    speakQuestion(res.questions[0]);
  
    // Start analyzing face every 2 seconds AFTER all above is ready
    setInterval(analyzeFace, 2000);
  };

  const drawFaceLoop = async () => {
    const canvas = faceapi.createCanvasFromMedia(videoRef.current!);
    canvas.id = 'face-canvas'; // give it an ID to avoid duplication
  
    if (!document.getElementById('face-canvas')) {
      videoRef.current?.parentElement?.appendChild(canvas);
    }
  
    faceapi.matchDimensions(canvas, {
      width: videoRef.current!.videoWidth,
      height: videoRef.current!.videoHeight,
    });
  
    setInterval(async () => {
      if (!modelsLoaded || !videoRef.current) return;
  
      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
  
      const resized = faceapi.resizeResults(detections, {
        width: videoRef.current!.videoWidth,
        height: videoRef.current!.videoHeight,
      });
  
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);
    }, 500);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            drawFaceLoop(); // start drawing loop
          };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const speakQuestion = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];
    mediaRecorder.start();
    console.log('🎙️ Recording Started');
  };

  const stopRecording = async (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          console.log('🎙️ Recording Stopped');
          resolve(blob);
        };
        mediaRecorderRef.current.stop();
      }
    });
  };

  const moveToNextQuestion = async () => {
    const blob = await stopRecording();

    try {
      const deepgramResult = await analyzeAudioWithDeepgram(blob);
      const transcript = deepgramResult.results.channels[0].alternatives[0].transcript;
      const confidence = deepgramResult.results.channels[0].alternatives[0].confidence;

      setResults((prev) => [
        ...prev,
        {
          question: questions[currentQuestionIndex],
          audioBlob: blob,
          transcript,
          confidence,
        },
      ]);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      await startRecording();
      speakQuestion(questions[currentQuestionIndex + 1]);
    } else {
      console.log('✅ Interview Finished');
      // TODO: Show evaluation summary
    }
  };

  const analyzeFace = async () => {
    if (!modelsLoaded || !videoRef.current) return;
  
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
  
    if (detection) {
      const { expressions, landmarks } = detection;
  
      const smilingScore = expressions.happy || 0;
      const emotion = Object.entries(expressions)
        .sort((a, b) => b[1] - a[1])[0][0];
  
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();
      const eyeDistance = Math.abs(leftEye[0].y - rightEye[3].y);
      const eyeContact = eyeDistance < 10;
  
      setBodyLanguageResults(prev => [
        ...prev,
        { smilingScore, eyeContact, emotion }
      ]);
  
      setResults(prev => {
        const updated = [...prev];
        if (updated[currentQuestionIndex]) {
          updated[currentQuestionIndex].bodyLanguage = {
            smilingScore,
            eyeContact,
            emotion,
          };
        }
        return updated;
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      {countdown > 0 ? (
        <h1 className="text-4xl font-bold">Starting in {countdown}...</h1>
      ) : (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">
            {questions.length > 0 ? `Question ${currentQuestionIndex + 1}:` : 'Loading...'}
          </h2>
          <p className="text-xl text-center mb-6">{questions[currentQuestionIndex]}</p>

          <video
            ref={videoRef}
            className="w-full max-w-md rounded-xl shadow-md mb-4"
            autoPlay
            muted
          />

          <button
            onClick={moveToNextQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-bold mt-4"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default StartInterview;