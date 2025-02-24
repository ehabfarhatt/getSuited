import { injectable } from 'inversify';
import 'reflect-metadata';
import Interview from '../models/Interview';

@injectable()
export default class InterviewService {
    async createInterview(user: string, type: 'technical' | 'behavioral', score?: number, feedback?: string) {
        return await Interview.create({ user, type, score, feedback });
    }

    async getInterviewsByUser(userId: string) {
        return await Interview.find({ user: userId });
    }

    async getAllInterviews() {
        return await Interview.find();
    }
}