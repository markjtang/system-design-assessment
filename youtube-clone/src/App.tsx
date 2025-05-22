import { useState, useCallback, useMemo } from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { mockVideos } from './data/mockVideos';
import type { Video } from './types/video';
import Header from './components/Header';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import './index.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return mockVideos;
    
    const query = searchQuery.toLowerCase();
    return mockVideos.filter(video => 
      video.title.toLowerCase().includes(query) ||
      video.channelName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleVideoClick = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  return (
    <FavoritesProvider>
      <div className="app">
        <Header onSearch={handleSearch} />
        <main className="main-content">
          <div className="container">
            <h2 className="section-title">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended Videos'}
              {searchQuery && (
                <button 
                  className="clear-search" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              )}
            </h2>
            <VideoList 
              videos={filteredVideos} 
              onVideoClick={handleVideoClick} 
            />
          </div>
        </main>
        
        {/* Video Player Modal */}
        {selectedVideo && (
          <VideoPlayer 
            video={selectedVideo} 
            onClose={handleClosePlayer} 
          />
        )}
      </div>
    </FavoritesProvider>
  );
};

export default App;
