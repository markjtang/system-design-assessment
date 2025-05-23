import { Request, Response } from 'express';
import { FavoriteModel } from '../models/Favorite';
import { ApiResponse } from '../types';

export class FavoriteController {
  static getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const favorites = await FavoriteModel.getFavoritesByUser(userId);
      
      const response: ApiResponse<typeof favorites> = {
        success: true,
        data: favorites
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch favorites'
      };
      res.status(500).json(response);
    }
  };
  
  static getFavoriteVideos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const videos = await FavoriteModel.getFavoriteVideosByUser(userId);
      
      const response: ApiResponse<typeof videos> = {
        success: true,
        data: videos
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching favorite videos:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch favorite videos'
      };
      res.status(500).json(response);
    }
  };
  
  static toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, videoId } = req.params;
      const result = await FavoriteModel.toggleFavorite(userId, videoId);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: result.message
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      let errorMessage = 'Failed to toggle favorite';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message === 'Video not found') {
          statusCode = 404;
          errorMessage = error.message;
        } else if (error.message === 'Video is already favorited') {
          statusCode = 400;
          errorMessage = error.message;
        }
      }
      
      const response: ApiResponse<null> = {
        success: false,
        error: errorMessage
      };
      res.status(statusCode).json(response);
    }
  };
  
  static addFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, videoId } = req.params;
      const favorite = await FavoriteModel.addFavorite(userId, videoId);
      
      const response: ApiResponse<typeof favorite> = {
        success: true,
        data: favorite,
        message: 'Added to favorites'
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error adding favorite:', error);
      
      let errorMessage = 'Failed to add favorite';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message === 'Video not found') {
          statusCode = 404;
          errorMessage = error.message;
        } else if (error.message === 'Video is already favorited') {
          statusCode = 400;
          errorMessage = error.message;
        }
      }
      
      const response: ApiResponse<null> = {
        success: false,
        error: errorMessage
      };
      res.status(statusCode).json(response);
    }
  };
  
  static removeFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, videoId } = req.params;
      const removed = await FavoriteModel.removeFavorite(userId, videoId);
      
      if (!removed) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Favorite not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'Removed from favorites'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error removing favorite:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to remove favorite'
      };
      res.status(500).json(response);
    }
  };
  
  static getFavoriteCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const count = await FavoriteModel.getFavoriteCount(userId);
      
      const response: ApiResponse<{ count: number }> = {
        success: true,
        data: { count }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error getting favorite count:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to get favorite count'
      };
      res.status(500).json(response);
    }
  };
  
  static checkFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, videoId } = req.params;
      const isFavorite = await FavoriteModel.isFavorite(userId, videoId);
      
      const response: ApiResponse<{ isFavorite: boolean }> = {
        success: true,
        data: { isFavorite }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error checking favorite:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to check favorite status'
      };
      res.status(500).json(response);
    }
  };
} 