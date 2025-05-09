import { injectable } from 'inversify';
import 'reflect-metadata';
import Course from '../models/Course';

@injectable()
export default class CourseService {
    async createCourse(title: string, description: string, price?: number) {
        return await Course.create({ title, description, price });
    }

    async getAllCourses() {
        return await Course.find();
    }

    async getCourseById(courseId: string) {
        return await Course.findById(courseId);
    }
}