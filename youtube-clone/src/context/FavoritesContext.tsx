import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DataService } from '../services/dataService';
import type { FavoritesContextType } from '../types/video';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favs = await DataService.getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (videoId: string) => {
    try {
      // Optimistic update
      const currentlyFavorited = favorites.includes(videoId);
      const newFavorites = currentlyFavorited
        ? favorites.filter(id => id !== videoId)
        : [...favorites, videoId];
      
      setFavorites(newFavorites);

      // Call the service
      const isFavorited = await DataService.toggleFavorite(videoId);
      
      // Sync with actual result (in case of API inconsistency)
      const updatedFavorites = isFavorited
        ? favorites.includes(videoId) ? favorites : [...favorites.filter(id => id !== videoId), videoId]
        : favorites.filter(id => id !== videoId);
      
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Revert optimistic update on error
      setFavorites(favorites);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    toggleFavorite,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
