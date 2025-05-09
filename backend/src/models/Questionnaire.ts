import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    field: { type: String, required: true },
});

const Questionnaire = mongoose.model('Questionnaire', QuestionSchema);
export default Questionnaire;