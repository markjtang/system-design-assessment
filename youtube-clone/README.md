# YouTube Clone – React + TypeScript + Vite

A simple YouTube-like video platform built with React, TypeScript, and Vite. This project demonstrates a scrollable list of videos, the ability to favorite videos, and a filter to show only your favorites.

## Features

- **Scrollable video list** with titles and thumbnails
- **Favorite videos** by clicking the heart icon on any video
- **Favorites filter**: Click the `❤️ X favorites` button in the header to toggle between all videos and only your favorited videos
- **Search**: Filter videos by title or channel name
- **Responsive design**
- **Favorites are persisted** in your browser (localStorage)

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## How to Use the Favorites Filter

- Click the `❤️ X favorites` button in the top right of the header to show only your favorited videos.
- The button turns red when the filter is active.
- Click again to return to all videos.
- You can also search within your favorites.
- If you have no favorites, a helpful message will appear.

## Project Structure

- `src/components/` – React components (Header, VideoList, VideoCard, etc.)
- `src/context/` – React context for managing favorites
- `src/data/` – Mock video data
- `src/types/` – TypeScript types
- `src/styles/` – CSS modules for styling

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
