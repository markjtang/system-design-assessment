import { API_CONFIG } from '../config/api';
import { ApiService } from './api';
import { mockVideos } from '../data/mockVideos';
import type { Video } from '../types/video';

export class DataService {
  // Videos
  static async getAllVideos(): Promise<Video[]> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.getAllVideos();
      } catch (error) {
        console.warn('API failed, falling back to mock data:', error);
        return mockVideos;
      }
    }
    return mockVideos;
  }

  static async searchVideos(query: string): Promise<Video[]> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.searchVideos(query);
      } catch (error) {
        console.warn('API search failed, falling back to mock search:', error);
        // Fallback to mock search
        const searchTerm = query.toLowerCase();
        return mockVideos.filter(video => 
          video.title.toLowerCase().includes(searchTerm) ||
          video.channelName.toLowerCase().includes(searchTerm)
        );
      }
    }
    
    // Mock search
    const searchTerm = query.toLowerCase();
    return mockVideos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.channelName.toLowerCase().includes(searchTerm)
    );
  }

  static async getVideoById(id: string): Promise<Video | null> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.getVideoById(id);
      } catch (error) {
        console.warn('API failed, falling back to mock data:', error);
        return mockVideos.find(video => video.id === id) || null;
      }
    }
    return mockVideos.find(video => video.id === id) || null;
  }

  // Favorites
  static async getFavorites(): Promise<string[]> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.getFavorites();
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
        return DataService.getLocalStorageFavorites();
      }
    }
    return DataService.getLocalStorageFavorites();
  }

  static async getFavoriteVideos(): Promise<Video[]> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.getFavoriteVideos();
      } catch (error) {
        console.warn('API failed, falling back to localStorage + mock data:', error);
        const favoriteIds = DataService.getLocalStorageFavorites();
        return mockVideos.filter(video => favoriteIds.includes(video.id));
      }
    }
    
    // Use localStorage + mock data
    const favoriteIds = DataService.getLocalStorageFavorites();
    return mockVideos.filter(video => favoriteIds.includes(video.id));
  }

  static async toggleFavorite(videoId: string): Promise<boolean> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.toggleFavorite(videoId);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
        return DataService.toggleLocalStorageFavorite(videoId);
      }
    }
    return DataService.toggleLocalStorageFavorite(videoId);
  }

  static async isFavorite(videoId: string): Promise<boolean> {
    if (API_CONFIG.USE_API) {
      try {
        return await ApiService.isFavorite(videoId);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
        const favorites = DataService.getLocalStorageFavorites();
        return favorites.includes(videoId);
      }
    }
    
    const favorites = DataService.getLocalStorageFavorites();
    return favorites.includes(videoId);
  }

  // localStorage helpers (private methods)
  private static getLocalStorageFavorites(): string[] {
    const saved = localStorage.getItem('youtube-clone-favorites');
    return saved ? JSON.parse(saved) : [];
  }

  private static saveLocalStorageFavorites(favorites: string[]): void {
    localStorage.setItem('youtube-clone-favorites', JSON.stringify(favorites));
  }

  private static toggleLocalStorageFavorite(videoId: string): boolean {
    const favorites = DataService.getLocalStorageFavorites();
    const isFavorited = favorites.includes(videoId);
    
    let newFavorites: string[];
    if (isFavorited) {
      newFavorites = favorites.filter(id => id !== videoId);
    } else {
      newFavorites = [...favorites, videoId];
    }
    
    DataService.saveLocalStorageFavorites(newFavorites);
    return !isFavorited; // Return new state
  }

  // Utility methods
  static isUsingApi(): boolean {
    return API_CONFIG.USE_API;
  }

  static async checkApiHealth(): Promise<boolean> {
    if (!API_CONFIG.USE_API) {
      return false;
    }
    return await ApiService.healthCheck();
  }
} 