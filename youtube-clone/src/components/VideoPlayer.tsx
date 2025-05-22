import type { Video } from '../types/video';
import '../styles/components/VideoPlayer.css';

interface VideoPlayerProps {
  video: Video | null;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  if (!video) return null;

  return (
    <div className="video-player-overlay" onClick={onClose}>
      <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close video">
          &times;
        </button>
        <div className="video-wrapper">
          <video
              className="video-element"
              src={video.videoUrl}
              controls
              autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-info">
          <h2 className="video-title">{video.title}</h2>
          <div className="video-meta">
            <span className="channel-name">{video.channelName}</span>
            <span className="view-count">{video.viewCount} views</span>
            <span className="timestamp">{video.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
