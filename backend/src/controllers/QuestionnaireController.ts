import { Request, Response } from 'express';
import { controller, httpPost, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import QuestionnaireService from '../services/QuestionnaireService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/questionnaire')
export default class QuestionnaireController {
    constructor(@inject(TYPES.QuestionnaireService) private questionnaireService: QuestionnaireService) {}

    @httpGet('/:category')
    public async getQuestionsByCategory(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { category } = req.params;
            const questions = await this.questionnaireService.getQuestionsByCategory(category);
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllQuestions(@response() res: Response): Promise<void> {
        try {
            const questions = await this.questionnaireService.getAllQuestions();
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpPost('/', authenticateJWT)
    public async createQuestion(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { question, options, correctAnswer, category } = req.body;
            const newQuestion = await this.questionnaireService.createQuestion(question, options, correctAnswer, category);
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}