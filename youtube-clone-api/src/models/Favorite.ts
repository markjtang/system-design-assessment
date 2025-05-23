import { getDatabase } from '../database/connection';
import { Favorite, Video } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class FavoriteModel {
  static async getFavoritesByUser(userId: string): Promise<string[]> {
    const db = getDatabase();
    const favorites = await db.all(
      'SELECT videoId FROM favorites WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return favorites.map(f => f.videoId);
  }
  
  static async getFavoriteVideosByUser(userId: string): Promise<Video[]> {
    const db = getDatabase();
    const videos = await db.all(`
      SELECT v.* FROM videos v
      INNER JOIN favorites f ON v.id = f.videoId
      WHERE f.userId = ?
      ORDER BY f.createdAt DESC
    `, [userId]);
    return videos;
  }
  
  static async isFavorite(userId: string, videoId: string): Promise<boolean> {
    const db = getDatabase();
    const favorite = await db.get(
      'SELECT id FROM favorites WHERE userId = ? AND videoId = ?',
      [userId, videoId]
    );
    return !!favorite;
  }
  
  static async addFavorite(userId: string, videoId: string): Promise<Favorite> {
    const db = getDatabase();
    
    // Check if already favorited
    const existing = await this.isFavorite(userId, videoId);
    if (existing) {
      throw new Error('Video is already favorited');
    }
    
    // Check if video exists
    const video = await db.get('SELECT id FROM videos WHERE id = ?', [videoId]);
    if (!video) {
      throw new Error('Video not found');
    }
    
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await db.run(
      'INSERT INTO favorites (id, userId, videoId, createdAt) VALUES (?, ?, ?, ?)',
      [id, userId, videoId, now]
    );
    
    const favorite = await db.get('SELECT * FROM favorites WHERE id = ?', [id]);
    if (!favorite) {
      throw new Error('Failed to create favorite');
    }
    
    return favorite;
  }
  
  static async removeFavorite(userId: string, videoId: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run(
      'DELETE FROM favorites WHERE userId = ? AND videoId = ?',
      [userId, videoId]
    );
    return result.changes ? result.changes > 0 : false;
  }
  
  static async toggleFavorite(userId: string, videoId: string): Promise<{ isFavorite: boolean; message: string }> {
    const isFav = await this.isFavorite(userId, videoId);
    
    if (isFav) {
      await this.removeFavorite(userId, videoId);
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      await this.addFavorite(userId, videoId);
      return { isFavorite: true, message: 'Added to favorites' };
    }
  }
  
  static async getFavoriteCount(userId: string): Promise<number> {
    const db = getDatabase();
    const result = await db.get(
      'SELECT COUNT(*) as count FROM favorites WHERE userId = ?',
      [userId]
    );
    return result.count || 0;
  }
} 