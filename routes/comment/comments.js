import express from 'express';
import Comment from '../../models/comments/comment_model.js';
import authenticateToken from '../auth/authenticate_token.js';
const commentRouter = express.Router();

commentRouter.post('/api/comments', authenticateToken, async (req, res) => {
    try {
        const { comment, username, poemId } = req.body;
        if (!comment) {
            return res.status(400).json({ message: 'Comment, username, and poemId are required.' });
        }
        const newComment = new Comment({ comment, username, poemId });
        await newComment.save();
        res.status(201).json({ message: 'Comment created successfully.', comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

commentRouter.get('/api/comments/:poemId', authenticateToken, async (req, res) => {
    try {
        const poemId = req.params.poemId;
        const filter = poemId ? { poemId } : {};
        const comments = await Comment.find(filter);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


export default commentRouter;
