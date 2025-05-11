import { injectable } from 'inversify';
import 'reflect-metadata';
import Course from '../models/Course';

@injectable()
export default class CourseService {
    // Update createCourse method to accept youtubeUrl, bookLink, and content
    async createCourse(title: string, description: string, price?: number, youtubeUrl?: string, bookLink?: string, content?: string) {
        return await Course.create({
            title,
            description,
            price,
            youtubeUrl,   // Handle youtubeUrl
            bookLink,     // Handle bookLink
            content       // Handle content
        });
    }

    async getAllCourses() {
        return await Course.find();
    }

    async getCourseById(courseId: string) {
        return await Course.findById(courseId);
    }
}
