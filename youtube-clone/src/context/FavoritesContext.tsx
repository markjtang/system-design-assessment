import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FavoritesContextType } from '../types/video';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Load favorites from localStorage if available
    const saved = localStorage.getItem('youtube-clone-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (videoId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(videoId)
        ? prevFavorites.filter(id => id !== videoId)
        : [...prevFavorites, videoId];
      
      // Save to localStorage
      localStorage.setItem('youtube-clone-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
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
