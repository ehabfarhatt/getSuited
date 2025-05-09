import { Container } from 'inversify';
import TYPES from './types'

// Import services
import UserService from '../services/UserService';
import CourseService from '../services/CourseService';
import InterviewService from '../services/InterviewService';
import QuestionnaireService from '../services/QuestionnaireService';
import AuthService from '../services/AuthService';

// Create DI container
const container = new Container();

// Bind services
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<CourseService>(TYPES.CourseService).to(CourseService);
container.bind<InterviewService>(TYPES.InterviewService).to(InterviewService);
container.bind<QuestionnaireService>(TYPES.QuestionnaireService).to(QuestionnaireService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);

export default container;