import express from 'express';
import bodyParser from 'body-parser';
import Poem from '../../models/poem/poem_model.js';
import authenticateToken from '../auth/authenticate_token.js';
import isPoet from '../auth/role.js';

const poemRouter = express.Router();

poemRouter.use(bodyParser.json());

poemRouter.post('/api/poems/',authenticateToken,isPoet, async (req, res) => {
    try {
        const { title, author, content, genre } = req.body;
        const poem = new Poem({ title, author, content, genre });
        await poem.save();
        res.status(201).json({ message: 'Poem created successfully.', poem });
    } catch (error) {
        console.error('Error creating poem:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Read all poems
poemRouter.get('/api/poems',authenticateToken, async (req, res) => {
    try {
        const poems = await Poem.find();
        res.status(200).json(poems);
    } catch (error) {
        console.error('Error fetching poems:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// Read a poem by ID
poemRouter.get('/api/poems/:id',authenticateToken, async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found.' });
        }
        res.status(200).json(poem);
    } catch (error) {
        console.error('Error fetching poem by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
poemRouter.put('/api/poems/:id',authenticateToken, isPoet, async (req, res) => {
    try {
        const updatedPoem = await Poem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPoem) {
            return res.status(404).json({ message: 'Poem not found.' });
        }
        res.status(201).json(updatedPoem);
    } catch (error) {
        console.error('Error updating poem by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
poemRouter.delete('/api/poems/:id',authenticateToken, isPoet, async (req, res) => {
    try {
        const deletedPoem = await Poem.findByIdAndDelete(req.params.id);
        if (!deletedPoem) {
            return res.status(404).json({ message: 'Poem not found.' });
        }
        res.status(200).json({ message: 'Poem deleted successfully.' });
    } catch (error) {
        console.error('Error deleting poem by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Search poems by title

poemRouter.get('/api/poems/search/:title', authenticateToken, async (req, res) => {
    try {

        const poems = await Poem.find({ 
            "$or": [
                { "title": { "$regex": req.params.title, "$options": "i" } } ]
        });

        res.status(200).json(poems);
    } catch (error) {
        console.error('Error searching poems by title:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});




export default poemRouter;