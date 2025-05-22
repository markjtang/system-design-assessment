import type { Video } from '../types/video';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/components/VideoCard.css';

interface VideoCardProps {
  video: Video;
  onVideoClick: (video: Video) => void;
}

const VideoCard = ({ video, onVideoClick }: VideoCardProps) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(video.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(video.id);
  };

  return (
    <div className="video-card" onClick={() => onVideoClick(video)}>
      <div className="thumbnail-container">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="thumbnail"
        />
        <span className="duration">{video.duration}</span>
        <button 
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <span className="channel-name">{video.channelName}</span>
          <span className="view-count">{video.viewCount} views</span>
          <span className="timestamp">{video.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
