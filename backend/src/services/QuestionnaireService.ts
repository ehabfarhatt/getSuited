import { injectable } from 'inversify';
import 'reflect-metadata';
import Questionnaire from '../models/Questionnaire';

@injectable()
export default class QuestionnaireService {
    async getQuestionsByCategory(category: string) {
        return await Questionnaire.find({ category });
    }

    async getAllQuestions() {
        return await Questionnaire.find();
    }

    async createQuestion(question: string, options: string[], correctAnswer: string, category: string) {
        return await Questionnaire.create({ question, options, correctAnswer, category });
    }
}