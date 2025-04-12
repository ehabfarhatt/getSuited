import 'reflect-metadata';
import express from 'express';
import connectDB from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import container from './config/inversify.config';
import { InversifyExpressServer } from 'inversify-express-utils';
import session from 'express-session';
import passport from 'passport';
import './passport/googleStrategy'; // register passport strategy
import './passport/linkedinStrategy';

// Import controllers
import './controllers/AuthController';
import './controllers/UserController';
import './controllers/CourseController';
import './controllers/InterviewController';
import './controllers/QuestionnaireController';
import './controllers/GoogleAuthController';
import './controllers/LinkedInAuthController';

dotenv.config();
connectDB();

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true // very important for cookie/session consistency
    }));
  
    app.use(express.json());
  
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
    }));
  
    app.use(passport.initialize());
    app.use(passport.session());
  });
// Create Inversify server
const app = server.build();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));