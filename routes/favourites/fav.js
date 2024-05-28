import express from 'express';
import authenticateToken from '../auth/authenticate_token.js';
import Favorites from '../../models/favorites/fav_model.js';
import Poem from '../../models/poem/poem_model.js';

const favRouter = express.Router();
favRouter.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
      const favorites = await Favorites.findOne({ userId: req.userId }).populate('poems');
  
      if (!favorites) {
        return res.status(404).json({ message: 'Favorites not found' });
      }
  
      res.status(200).json(favorites.poems);
    } catch (error) {
      console.error('Error getting favorites:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  favRouter.post('/api/favorites', authenticateToken, async (req, res) => {
    try {
      const { PoemId } = req.body;
  
      const poem = await Poem.findById(PoemId);
      if (!poem) {
        return res.status(404).json({ message: 'Poem not found' });
      }
  
      const favorite = await Favorites.findOneAndUpdate(
        { userId: req.userId },
        { $addToSet: { poems: poem._id } },
        { upsert: true, new: true }
      );
  
      res.status(201).json(favorite.poems);
    } catch (error) {
      console.error('Error adding poem to favorites:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  favRouter.delete('/api/favorites/:poemId', authenticateToken, async (req, res) => {
    try {
      const favorite = await Favorites.findOneAndUpdate(
        { userId: req.userId },
        { $pull: { poems: req.params.poemId } },
        { new: true }
      );
  
      if (!favorite) {
        return res.status(404).json({ message: 'Favorites not found' });
      }
  
      res.status(200).json(favorite.poems);
    } catch (error) {
      console.error('Error removing poem from favorites:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
export default favRouter;