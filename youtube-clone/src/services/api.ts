import { API_CONFIG, getApiUrl } from '../config/api';
import type { Video } from '../types/video';

// API Response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiService {
  // Videos API
  static async getAllVideos(): Promise<Video[]> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VIDEOS));
      const result: ApiResponse<Video[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch videos');
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  static async searchVideos(query: string): Promise<Video[]> {
    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.VIDEOS)}?search=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const result: ApiResponse<Video[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to search videos');
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  static async getVideoById(id: string): Promise<Video | null> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.VIDEOS}/${id}`));
      const result: ApiResponse<Video> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching video:', error);
      return null;
    }
  }

  // Favorites API
  static async getFavorites(userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<string[]> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/user/${userId}`));
      const result: ApiResponse<string[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  static async getFavoriteVideos(userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<Video[]> {
    try {
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/user/${userId}/videos`));
      const result: ApiResponse<Video[]> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching favorite videos:', error);
      return [];
    }
  }

  static async toggleFavorite(videoId: string, userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<boolean> {
    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/video/${videoId}/user/${userId}/toggle`),
        { method: 'POST' }
      );
      const result: ApiResponse<{ isFavorite: boolean; message: string }> = await response.json();
      
      if (result.success && result.data) {
        return result.data.isFavorite;
      }
      throw new Error(result.error || 'Failed to toggle favorite');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  static async addFavorite(videoId: string, userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<void> {
    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/video/${videoId}/user/${userId}`),
        { method: 'POST' }
      );
      const result: ApiResponse<any> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add favorite');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  static async removeFavorite(videoId: string, userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<void> {
    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/video/${videoId}/user/${userId}`),
        { method: 'DELETE' }
      );
      const result: ApiResponse<any> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  static async isFavorite(videoId: string, userId: string = API_CONFIG.DEFAULT_USER_ID): Promise<boolean> {
    try {
      const response = await fetch(
        getApiUrl(`${API_CONFIG.ENDPOINTS.FAVORITES}/video/${videoId}/user/${userId}/check`)
      );
      const result: ApiResponse<{ isFavorite: boolean }> = await response.json();
      
      if (result.success && result.data) {
        return result.data.isFavorite;
      }
      return false;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HEALTH));
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
} 