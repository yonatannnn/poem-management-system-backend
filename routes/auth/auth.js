import express from 'express';
import bodyParser from 'body-parser';
import User from '../../models/auth/auth_model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authenticateToken from '../auth/authenticate_token.js';
import isPoet from './role.js';

const router = express.Router();

router.use(bodyParser.json());

router.post('/api/login', async (req, res) => { 
    try { 
        const { email, password , username} = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id , role: user.role},'secret', { expiresIn: '1h' });

        res.status(200).json({ user: user, "token": token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
     }
});
router.post('/api/register', async (req, res) => {

    try {
        const { username, password, email, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists please try using another email' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id , role: newUser.role},'secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'User created successfully.', user: newUser, "token": token });

        
    } catch (err) { 
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
    }

});


router.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;
        const userId = req.userId;
        console.log(req);
        const userRole = req.role;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (username){
            user.username = username;
        }
        if (role) {
            user.role = role;
        }

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/api/logout', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Logged out successfully.' });
});

router.get('/', authenticateToken, (req, res) => {})

router.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        console.log(userId)


        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




export default router;