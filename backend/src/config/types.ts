const TYPES = {
    UserService: Symbol.for('UserService'),
    CourseService: Symbol.for('CourseService'),
    InterviewService: Symbol.for('InterviewService'),
    QuestionnaireService: Symbol.for('QuestionnaireService'),
    AuthService: Symbol.for('AuthService'),
    EmailService: Symbol.for('EmailService'),  // Ensure EmailService is defined here
};

export default TYPES;