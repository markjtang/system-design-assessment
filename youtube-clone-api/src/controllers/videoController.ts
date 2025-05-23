import { Request, Response } from 'express';
import { VideoModel } from '../models/Video';
import { ApiResponse } from '../types';

export class VideoController {
  static getAllVideos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search } = req.query;
      
      let videos;
      if (search && typeof search === 'string') {
        videos = await VideoModel.searchVideos(search);
      } else {
        videos = await VideoModel.getAllVideos();
      }
      
      const response: ApiResponse<typeof videos> = {
        success: true,
        data: videos
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching videos:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch videos'
      };
      res.status(500).json(response);
    }
  };
  
  static getVideoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const video = await VideoModel.getVideoById(id);
      
      if (!video) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Video not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<typeof video> = {
        success: true,
        data: video
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching video:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch video'
      };
      res.status(500).json(response);
    }
  };
  
  static createVideo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, thumbnailUrl, channelName, viewCount, duration, videoUrl } = req.body;
      
      // Basic validation
      if (!title || !thumbnailUrl || !channelName || !viewCount || !duration) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Missing required fields: title, thumbnailUrl, channelName, viewCount, duration'
        };
        res.status(400).json(response);
        return;
      }
      
      const video = await VideoModel.createVideo({
        title,
        thumbnailUrl,
        channelName,
        viewCount,
        duration,
        videoUrl
      });
      
      const response: ApiResponse<typeof video> = {
        success: true,
        data: video,
        message: 'Video created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating video:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create video'
      };
      res.status(500).json(response);
    }
  };
  
  static updateVideo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const video = await VideoModel.updateVideo(id, updates);
      
      if (!video) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Video not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<typeof video> = {
        success: true,
        data: video,
        message: 'Video updated successfully'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error updating video:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update video'
      };
      res.status(500).json(response);
    }
  };
  
  static deleteVideo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await VideoModel.deleteVideo(id);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Video not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'Video deleted successfully'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error deleting video:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete video'
      };
      res.status(500).json(response);
    }
  };
} 