import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['technical', 'behavioral'], required: true },
    score: { type: Number, required: false },
    feedback: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Interview = mongoose.model('Interview', InterviewSchema);
export default Interview;