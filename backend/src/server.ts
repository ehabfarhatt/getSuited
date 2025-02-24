import 'reflect-metadata';
import express from 'express';
import connectDB from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import container from './config/inversify.config';
import { InversifyExpressServer } from 'inversify-express-utils';

// Import controllers
import './controllers/AuthController';
import './controllers/UserController';
import './controllers/CourseController';
import './controllers/InterviewController';
import './controllers/QuestionnaireController';

dotenv.config();
connectDB();

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(express.json());
});
// Create Inversify server
const app = server.build();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));