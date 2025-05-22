import type { Video } from '../types/video';
import VideoCard from './VideoCard';
import '../styles/components/VideoList.css';

interface VideoListProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}

const VideoList = ({ videos, onVideoClick }: VideoListProps) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onVideoClick={onVideoClick} 
        />
      ))}
    </div>
  );
};

export default VideoList;
