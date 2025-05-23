export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  viewCount: string;
  timestamp: string;
  duration: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
}

export interface CreateVideoRequest {
  title: string;
  thumbnailUrl: string;
  channelName: string;
  viewCount: string;
  duration: string;
  videoUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 