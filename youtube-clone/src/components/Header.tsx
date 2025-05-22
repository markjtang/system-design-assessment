import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import '../styles/components/Header.css';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-icon">📺</span>
        <h1>YouTube Clone</h1>
      </div>
      
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </form>
      
      <div className="favorites-count">
        ❤️ {favorites.length} favorites
      </div>
    </header>
  );
};

export default Header;
