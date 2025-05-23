import { useState, useCallback, useMemo, useEffect } from 'react';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { DataService } from './services/dataService';
import type { Video } from './types/video';
import Header from './components/Header';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import './index.css';

const AppContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();
  
  // Load videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const allVideos = await DataService.getAllVideos();
        setVideos(allVideos);
      } catch (err) {
        console.error('Failed to load videos:', err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Filter videos based on search query and favorites filter
  const filteredVideos = useMemo(() => {
    let filteredResults = videos;
    
    // Filter by favorites if enabled
    if (showFavoritesOnly) {
      filteredResults = videos.filter(video => favorites.includes(video.id));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredResults = filteredResults.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.channelName.toLowerCase().includes(query)
      );
    }
    
    return filteredResults;
  }, [searchQuery, showFavoritesOnly, favorites, videos]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    // If user searches, exit favorites-only mode
    if (query.trim()) {
      setShowFavoritesOnly(false);
      
      // Perform search via API if available
      try {
        setLoading(true);
        const searchResults = await DataService.searchVideos(query);
        setVideos(searchResults);
      } catch (err) {
        console.error('Search failed:', err);
        // The filteredVideos will handle client-side search as fallback
      } finally {
        setLoading(false);
      }
    } else {
      // Reload all videos when search is cleared
      try {
        setLoading(true);
        const allVideos = await DataService.getAllVideos();
        setVideos(allVideos);
      } catch (err) {
        console.error('Failed to reload videos:', err);
      } finally {
        setLoading(false);
      }
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

  // Show loading state
  if (loading && videos.length === 0) {
    return (
      <div className="app">
        <Header 
          onSearch={handleSearch} 
          onToggleFavorites={handleToggleFavorites}
          showFavoritesOnly={showFavoritesOnly}
        />
        <main className="main-content">
          <div className="container">
            <div className="loading-message">
              <h2>Loading videos...</h2>
              <p>Please wait while we fetch the latest content.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error && videos.length === 0) {
    return (
      <div className="app">
        <Header 
          onSearch={handleSearch} 
          onToggleFavorites={handleToggleFavorites}
          showFavoritesOnly={showFavoritesOnly}
        />
        <main className="main-content">
          <div className="container">
            <div className="error-message">
              <h2>⚠️ {error}</h2>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
          {loading && (
            <p className="loading-message">Updating...</p>
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
