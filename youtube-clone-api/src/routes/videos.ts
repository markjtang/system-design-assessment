import { Router } from 'express';
import { VideoController } from '../controllers/videoController';

const router = Router();

// GET /api/videos - Get all videos (with optional search)
router.get('/', VideoController.getAllVideos);

// GET /api/videos/:id - Get video by ID
router.get('/:id', VideoController.getVideoById);

// POST /api/videos - Create new video
router.post('/', VideoController.createVideo);

// PUT /api/videos/:id - Update video
router.put('/:id', VideoController.updateVideo);

// DELETE /api/videos/:id - Delete video
router.delete('/:id', VideoController.deleteVideo);

export default router; 