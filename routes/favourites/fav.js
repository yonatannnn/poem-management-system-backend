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
    const poemId = req.body.PoemId;
    console.log(req.body);
    console.log(poemId);
    const poem = await Poem.findById(poemId);
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

favRouter.put('/api/poems/:poemId', authenticateToken, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const poem = await Poem.findByIdAndUpdate(
      req.params.poemId,
      { title, content, author },
      { new: true }
    );

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    res.status(200).json(poem);
  } catch (error) {
    console.error('Error updating poem:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

favRouter.delete('/api/poems/:poemId', authenticateToken, async (req, res) => {
  try {
    const poem = await Poem.findByIdAndDelete(req.params.poemId);

    if (!poem) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    res.status(200).json({ message: 'Poem deleted successfully' });
  } catch (error) {
    console.error('Error deleting poem:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default favRouter;
