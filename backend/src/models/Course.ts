import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false }, // Optional for paid courses
    youtubeUrl: { type: String, required: false },  // Optional field for YouTube video URL
    bookLink: { type: String, required: false },    // Optional field for book link
    content: { type: String, required: false },     // Optional field for course content
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;
