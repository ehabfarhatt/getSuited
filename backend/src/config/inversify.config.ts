import { Container } from 'inversify';
import TYPES from './types';  // Ensure TYPES is imported correctly

// Import services
import UserService from '../services/UserService';
import CourseService from '../services/CourseService';
import InterviewService from '../services/InterviewService';
import QuestionnaireService from '../services/QuestionnaireService';
import AuthService from '../services/AuthService';
import EmailService from '../services/emailService';  // Ensure proper import

// Create DI container
const container = new Container();

// Bind services to the container
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<CourseService>(TYPES.CourseService).to(CourseService);
container.bind<InterviewService>(TYPES.InterviewService).to(InterviewService);
container.bind<QuestionnaireService>(TYPES.QuestionnaireService).to(QuestionnaireService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<EmailService>(TYPES.EmailService).to(EmailService);  // Corrected binding of EmailService

export default container;