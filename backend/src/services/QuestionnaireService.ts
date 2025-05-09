import { injectable } from 'inversify';
import 'reflect-metadata';
import Questionnaire from '../models/Questionnaire';

@injectable()
export default class QuestionnaireService {
    async getQuestionsByField(field: string) {
        return await Questionnaire.find({ field });
    }

    async getAllQuestions() {
        return await Questionnaire.find();
    }

    async createQuestion(question: string, options: string[], correctAnswer: string, field: string) {
        return await Questionnaire.create({ question, options, correctAnswer, field });
    }
}