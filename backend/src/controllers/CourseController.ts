import { Request, Response } from 'express';
import { controller, httpPost, httpGet, requestParam, requestBody, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../config/types';
import CourseService from '../services/CourseService';

@controller('/courses')
export default class CourseController {
    constructor(@inject(TYPES.CourseService) private courseService: CourseService) {}

    @httpPost('/add')
    public async createCourse(
        @requestBody() body: { title: string; description: string; price?: number },
        @response() res: Response
    ): Promise<void> {
        try {
            const course = await this.courseService.createCourse(body.title, body.description, body.price);
            res.status(201).json(course);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/')
    public async getAllCourses(@response() res: Response): Promise<void> {
        try {
            const courses = await this.courseService.getAllCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    @httpGet('/:id')
    public async getCourseById(
        @requestParam('id') id: string,
        @response() res: Response
    ): Promise<void> {
        try {
            const course = await this.courseService.getCourseById(id);
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }
            res.json(course);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}