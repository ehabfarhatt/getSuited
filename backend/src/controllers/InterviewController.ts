import { Request, Response } from 'express';
import { controller, httpPost, httpGet, request, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import InterviewService from '../services/InterviewService';
import { authenticateJWT } from '../middleware/AuthMiddleware';

@controller('/interviews')
export default class InterviewController {
    constructor(@inject(TYPES.InterviewService) private interviewService: InterviewService) {}

    @httpPost('/', authenticateJWT)
    public async createInterview(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { user, type, score, feedback } = req.body;
            const interview = await this.interviewService.createInterview(user, type, score, feedback);
            res.status(201).json(interview);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/:userId')
    public async getInterviewsByUser(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const interviews = await this.interviewService.getInterviewsByUser(req.params.userId);
            res.json(interviews);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllInterviews(@response() res: Response): Promise<void> {
        try {
            const interviews = await this.interviewService.getAllInterviews();
            res.json(interviews);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}