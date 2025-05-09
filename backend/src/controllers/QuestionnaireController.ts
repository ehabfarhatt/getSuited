import { Request, Response } from 'express';
import { controller, httpPost, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import QuestionnaireService from '../services/QuestionnaireService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/questionnaire')
export default class QuestionnaireController {
    constructor(@inject(TYPES.QuestionnaireService) private questionnaireService: QuestionnaireService) {}

    @httpGet('/:field')
public async getQuestionsByField(@request() req: Request, @response() res: Response): Promise<void> {
    try {
        const { field } = req.params;
        console.log("Requested field:", field); // Debug log
        const questions = await this.questionnaireService.getQuestionsByField(field);
        console.log("Fetched questions:", questions); // Debug log
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
            const { question, options, correctAnswer, field } = req.body;
            const newQuestion = await this.questionnaireService.createQuestion(question, options, correctAnswer, field);
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}