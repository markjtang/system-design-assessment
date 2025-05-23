export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  viewCount: string;
  timestamp: string;
  duration: string;
  videoUrl?: string;
}

export interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (videoId: string) => Promise<void>;
  loading?: boolean;
}
