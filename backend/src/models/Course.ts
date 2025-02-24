import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false }, // Optional for paid courses
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;