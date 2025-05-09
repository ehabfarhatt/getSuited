import React, { useEffect, useState, useRef } from 'react';
import { fetchInterviewQuestions } from '../../../services/interviewService';
import { analyzeAudioWithDeepgram } from '../../../services/deepgramService';
import * as faceapi from 'face-api.js';
import { analyzeToneWithAssembly } from '../../../services/toneService';
import { useNavigate } from 'react-router-dom';
import './BehavioralInterview.css'
interface StartInterviewProps {
    interviewDetails: {
      position: string;
      workType: string;
      seniority: string;
      companyName: string;
      workModel: string;
    };
    onInterviewComplete: (results: EvaluationResult[]) => void;
  }

type EvaluationResult = {
  question: string;
  audioBlob: Blob;
  transcript: string;
  confidence: number;
  bodyLanguage?: BodyLanguageMetrics;
  toneConfidence?: number;
};

type BodyLanguageMetrics = {
    smilingScore: number;
    eyeContact: boolean;
    emotion: string;
    blink: boolean;
    mouthOpenness: number;
    headPose: {
      yaw: number;
      pitch: number;
      roll: number;
    };
    timestamp: number;
    confidence?: number;
    sentiment?: string;
  };

  type FaceFrame = BodyLanguageMetrics & {
    blink: boolean;
    mouthOpenness: number;
    headPose: {
      yaw: number;
      pitch: number;
      roll: number;
    };
    timestamp: number;
  };

  const StartInterview: React.FC<StartInterviewProps> = ({ interviewDetails, onInterviewComplete }) => {
  const [countdown, setCountdown] = useState(5);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [bodyLanguageResults, setBodyLanguageResults] = useState<BodyLanguageMetrics[]>([]);
  const faceDataRef = useRef<FaceFrame[]>([]);
    const faceIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);


function stddev(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      startInterview();
    }
  }, [countdown, modelsLoaded]);

  useEffect(() => {
    const loadModels = async () => {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
  
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
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
    speakQuestion(res.questions[0], async () => {
        await startRecording();
        startFaceTracking();
      });
  
    // Start analyzing face every 2 seconds AFTER all above is ready
    setInterval(analyzeFace, 2000);
  };

  function calculateEAR(eye: faceapi.Point[]) {
    const A = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
    const B = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
    const C = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
    return (A + B) / (2.0 * C);
  }

  const startFaceTracking = () => {
    faceDataRef.current = []; // Reset for current question
    faceIntervalRef.current = setInterval(async () => {
      if (!modelsLoaded || !videoRef.current) return;
  
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceExpressions();
  
      if (detection) {
        const { expressions, landmarks } = detection;

        
  
        const smilingScore = expressions.happy || 0;
        const emotion = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
  
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const mouth = landmarks.getMouth();
        const nose = landmarks.getNose();
        const jaw = landmarks.getJawOutline();

        const yaw = leftEye[0].x - rightEye[3].x;
        const eyeContact = Math.abs(yaw) < 25; // closer to facing front
  
        const eyeDistance = Math.abs(leftEye[0].y - rightEye[3].y);
        //const eyeContact = eyeDistance < 10;
  
        const eyeYDiff = Math.abs(leftEye[1].y - rightEye[1].y);
        //const blink = eyeYDiff < 5; // crude approximation
  
        const mouthOpenness = Math.abs(mouth[14].y - mouth[18].y); // bottom-top lips

        const leftEAR = calculateEAR(leftEye);
        const rightEAR = calculateEAR(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2;
        const blink = avgEAR < 0.28;
        
        console.log("EAR:", avgEAR);
  
        const headPose = {
          yaw: leftEye[0].x - rightEye[3].x,
          pitch: nose[3].y - jaw[8].y,
          roll: leftEye[0].y - rightEye[3].y,
        };
  
        faceDataRef.current.push({
          smilingScore,
          eyeContact,
          emotion,
          blink,
          mouthOpenness,
          headPose,
          timestamp: Date.now()
        });
      }
    }, 1000);
  };
  
  const stopFaceTracking = (): BodyLanguageMetrics & { confidence: number } => {
    if (faceIntervalRef.current) {
      clearInterval(faceIntervalRef.current);
      faceIntervalRef.current = null;
    }
  
    const data = faceDataRef.current;
    if (data.length === 0) {
      return {
        smilingScore: 0,
        eyeContact: false,
        emotion: 'neutral',
        blink: false,
        mouthOpenness: 0,
        headPose: { yaw: 0, pitch: 0, roll: 0 },
        timestamp: Date.now(),
        confidence: 0,
      };
    }
  
    const smileTimePercent = data.filter(d => d.smilingScore > 0.4).length / data.length;
    const emotionVariance = new Set(data.map(d => d.emotion)).size / data.length;
  
    const headYawVar = stddev(data.map(d => d.headPose.yaw));
    const headPitchVar = stddev(data.map(d => d.headPose.pitch));
    const headRollVar = stddev(data.map(d => d.headPose.roll));
    const headPoseVariance = (headYawVar + headPitchVar + headRollVar) / 3;
    const headPoseVarianceCapped = Math.min(headPoseVariance, 5);
    const headPoseVarianceNorm = headPoseVarianceCapped / 5;
  
    const blinkRate = data.filter(d => d.blink).length / data.length;
    const blinkRateNormalized = Math.min(blinkRate / 0.3, 1); // 0.3 ~ natural rate
  
    const mouthSteadinessScoreRaw = 1 - stddev(data.map(d => d.mouthOpenness));
    const mouthSteadinessScore = Math.max(0, Math.min(1, mouthSteadinessScoreRaw));
  
    // 💡 New confidence formula — no eyeContact
    const confidence =
      0.4 * (1 - headPoseVarianceNorm) +
      0.25 * (1 - emotionVariance) +
      0.1 * (1 - blinkRateNormalized) +
      0.15 * mouthSteadinessScore +
      0.1 * smileTimePercent;
  
    const last = data[data.length - 1];
    console.log('🧠 Confidence:', confidence.toFixed(4));
    console.log({
      smileTimePercent,
      emotionVariance,
      headPoseVariance,
      blinkRateNormalized,
      mouthSteadinessScore,
    });
  
    return {
      ...last,
      confidence: Math.max(0, Math.min(1, confidence)),
    };
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
        .detectAllFaces(videoRef.current!, new faceapi.SsdMobilenetv1Options())
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

  const speakQuestion = (text: string, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = onEnd || null;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream; // Save audio stream for later cleanup
  
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
    const bodyLanguage = stopFaceTracking();

    try {
      const deepgramResult = await analyzeAudioWithDeepgram(blob);
      const transcript = deepgramResult.results.channels[0].alternatives[0].transcript;
      const index = results.length;

      const newEntry: EvaluationResult = {
        question: questions[currentQuestionIndex],
        audioBlob: blob,
        transcript,
        confidence: bodyLanguage.confidence,
        toneConfidence: undefined,
        bodyLanguage: {
          ...bodyLanguage,
          confidence: bodyLanguage.confidence,
        },
      };

      const updatedResults = [...results, newEntry];
      setResults(updatedResults);

      // Start tone analysis in the background
      analyzeToneWithAssembly(blob).then((assemblyResult) => {
        const refined = [...updatedResults];
        refined[index] = {
          ...refined[index],
          toneConfidence: assemblyResult.confidence,
          bodyLanguage: {
            ...refined[index].bodyLanguage!,
            sentiment: assemblyResult.sentiment,
          },
        };
        setResults(refined);
      });

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        speakQuestion(questions[currentQuestionIndex + 1], async () => {
          await startRecording();
          startFaceTracking();
        });
      } else {
        console.log('✅ Interview Finished');

        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        onInterviewComplete(updatedResults);
        await stopRecording();
      }
    } catch (error) {
      console.error('Error analyzing audio:', error);
    }
  };

  const analyzeFace = async () => {
    if (!modelsLoaded || !videoRef.current) return;
  
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
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
    }
  };
  
  return (
    <div className="start-interview-container">
      {countdown > 0 ? (
        <div className="countdown">{countdown}</div>
      ) : (
        <div className="interview-layout">
          <div className="video-section">
            <h2 className="question-heading">
              {questions.length > 0 ? `Question ${currentQuestionIndex + 1}:` : 'Loading...'}
            </h2>
            <p className="question-text">{questions[currentQuestionIndex]}</p>
  
            <video
              ref={videoRef}
              className="video-box"
              autoPlay
              muted
            />
  
            <button
              onClick={moveToNextQuestion}
              className="next-btn"
            >
              Next Question
            </button>
          </div>
  
          <div className="ai-voice-wave">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartInterview;