import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    username: { type: String, required: true },
    poemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poem', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
