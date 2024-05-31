import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import authenticateToken from '../auth/authenticate_token.js';
import User from '../../models/auth/auth_model.js';

const router = express.Router();

router.use(bodyParser.json());

router.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const { username, password , role} = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (username) {
            user.username = username;
        }
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        if (role) {
            user.role = role;
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
