import { useState, useCallback, useMemo } from 'react';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { mockVideos } from './data/mockVideos';
import type { Video } from './types/video';
import Header from './components/Header';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import './index.css';

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites } = useFavorites();
  
  // Filter videos based on search query and favorites filter
  const filteredVideos = useMemo(() => {
    let videos = mockVideos;
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      videos = videos.filter(video => favorites.includes(video.id));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.channelName.toLowerCase().includes(query)
      );
    }
    
    return videos;
  }, [searchQuery, showFavoritesOnly, favorites]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // If user searches, exit favorites-only mode
    if (query.trim()) {
      setShowFavoritesOnly(false);
    }
  }, []);

  const handleVideoClick = useCallback((video: Video) => {
    setSelectedVideo(video);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setSelectedVideo(null);
  }, []);

  const handleToggleFavorites = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
    // Clear search when toggling favorites view
    if (!showFavoritesOnly) {
      setSearchQuery('');
    }
  }, [showFavoritesOnly]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setShowFavoritesOnly(false);
  }, []);

  const getSectionTitle = () => {
    if (showFavoritesOnly) {
      return `My Favorites (${filteredVideos.length} videos)`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return 'Recommended Videos';
  };

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch} 
        onToggleFavorites={handleToggleFavorites}
        showFavoritesOnly={showFavoritesOnly}
      />
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">
            {getSectionTitle()}
            {(searchQuery || showFavoritesOnly) && (
              <button 
                className="clear-search" 
                onClick={handleClearFilters}
              >
                {showFavoritesOnly ? 'Show all videos' : 'Clear search'}
              </button>
            )}
          </h2>
          {showFavoritesOnly && filteredVideos.length === 0 && (
            <p className="no-results">
              You haven't favorited any videos yet. Click the ❤️ on videos to add them to your favorites!
            </p>
          )}
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
  );
};

const App = () => {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
};

export default App;
