import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/database';
import container from './config/inversify.config';
import { InversifyExpressServer } from 'inversify-express-utils';

// auto‑register controllers
import './controllers/AuthController';
import './controllers/UserController';
import './controllers/CourseController';
import './controllers/InterviewController';
import './controllers/QuestionnaireController';

dotenv.config();
connectDB();

const server = new InversifyExpressServer(container);

server.setConfig(app => {
  /* ---------- CORS ---------- */
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,                                 // allow cookies / auth‑headers
      methods: 'GET,POST,PATCH,PUT,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    }),
  );

  /* ---------- Body parsers ---------- */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /* ---------- Static uploads ---------- */
  //  …/backend/uploads/  →  http://localhost:5001/uploads/<file>
  // in server.ts
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

});

const app  = server.build();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀  API ready on port ${PORT}`));
