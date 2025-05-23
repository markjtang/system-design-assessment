import { getDatabase } from '../database/connection';
import { Video, CreateVideoRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class VideoModel {
  static async getAllVideos(): Promise<Video[]> {
    const db = getDatabase();
    const videos = await db.all('SELECT * FROM videos ORDER BY createdAt DESC');
    return videos;
  }
  
  static async getVideoById(id: string): Promise<Video | null> {
    const db = getDatabase();
    const video = await db.get('SELECT * FROM videos WHERE id = ?', [id]);
    return video || null;
  }
  
  static async searchVideos(query: string): Promise<Video[]> {
    const db = getDatabase();
    const searchTerm = `%${query}%`;
    const videos = await db.all(
      'SELECT * FROM videos WHERE title LIKE ? OR channelName LIKE ? ORDER BY createdAt DESC',
      [searchTerm, searchTerm]
    );
    return videos;
  }
  
  static async createVideo(videoData: CreateVideoRequest): Promise<Video> {
    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    await db.run(
      `INSERT INTO videos (id, title, thumbnailUrl, channelName, viewCount, timestamp, duration, videoUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        videoData.title,
        videoData.thumbnailUrl,
        videoData.channelName,
        videoData.viewCount,
        'just now',
        videoData.duration,
        videoData.videoUrl,
        now,
        now
      ]
    );
    
    const video = await this.getVideoById(id);
    if (!video) {
      throw new Error('Failed to create video');
    }
    
    return video;
  }
  
  static async updateVideo(id: string, updates: Partial<CreateVideoRequest>): Promise<Video | null> {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    const setParts: string[] = [];
    const values: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setParts.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (setParts.length === 0) {
      return this.getVideoById(id);
    }
    
    setParts.push('updatedAt = ?');
    values.push(now, id);
    
    await db.run(
      `UPDATE videos SET ${setParts.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.getVideoById(id);
  }
  
  static async deleteVideo(id: string): Promise<boolean> {
    const db = getDatabase();
    const result = await db.run('DELETE FROM videos WHERE id = ?', [id]);
    return result.changes ? result.changes > 0 : false;
  }
} 