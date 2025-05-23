import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController';

const router = Router();

// Routes structured to avoid parameter conflicts

// GET /api/favorites/user/:userId/videos - Get user's favorite videos with full details
router.get('/user/:userId/videos', FavoriteController.getFavoriteVideos);

// GET /api/favorites/user/:userId/count - Get user's favorite count
router.get('/user/:userId/count', FavoriteController.getFavoriteCount);

// GET /api/favorites/user/:userId - Get user's favorite video IDs
router.get('/user/:userId', FavoriteController.getFavorites);

// POST /api/favorites/video/:videoId/user/:userId/toggle - Toggle favorite status
router.post('/video/:videoId/user/:userId/toggle', FavoriteController.toggleFavorite);

// POST /api/favorites/video/:videoId/user/:userId - Add to favorites
router.post('/video/:videoId/user/:userId', FavoriteController.addFavorite);

// DELETE /api/favorites/video/:videoId/user/:userId - Remove from favorites
router.delete('/video/:videoId/user/:userId', FavoriteController.removeFavorite);

// GET /api/favorites/video/:videoId/user/:userId/check - Check if video is favorited
router.get('/video/:videoId/user/:userId/check', FavoriteController.checkFavorite);

export default router; 