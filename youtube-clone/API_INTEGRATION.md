# API Integration Guide

This YouTube Clone frontend can work with either mock data or a live backend API. Here's how to configure and use both modes.

## Configuration

### Switch Between Mock Data and API

Edit the file `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  // Set to true to use the backend API, false to use mock data
  USE_API: false, // Change this to true when you want to use the backend
  
  // API Base URL
  BASE_URL: 'http://localhost:3001',
  
  // Default user ID for API calls
  DEFAULT_USER_ID: 'user-123',
  
  // ... rest of config
};
```

## Using Mock Data (Default)

**Setting:** `USE_API: false`

- **Videos:** Uses local mock data from `src/data/mockVideos.ts`
- **Favorites:** Stored in browser localStorage
- **Search:** Client-side filtering of mock data
- **No network requests:** Works completely offline

## Using Backend API

**Setting:** `USE_API: true`

- **Videos:** Fetched from backend API at `http://localhost:3001/api/videos`
- **Favorites:** Managed by backend database with user-specific storage
- **Search:** Server-side search via API
- **Fallback:** Automatically falls back to mock data if API is unavailable

## Features

### 🔄 Automatic Fallback
If the API is unavailable, the app automatically falls back to mock data and shows a warning indicator.

### 📊 Data Source Indicator
The header shows the current data source:
- 💾 **Using Mock Data** - Currently using local mock data
- 🟢 **API Connected** - Successfully connected to backend API  
- 🔴 **API Offline** - API unavailable, using fallback mock data
- ⏳ **Checking API...** - Currently checking API connection

### ⚡ Optimistic Updates
When using the API, favorites are updated immediately in the UI while the API call happens in the background.

### 🔍 Smart Search
- **Mock Mode:** Client-side search through mock videos
- **API Mode:** Server-side search with fallback to client-side if API fails

## API Endpoints Used

When `USE_API: true`, the frontend uses these backend endpoints:

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos?search=query` - Search videos

### Favorites  
- `GET /api/favorites/user/{userId}` - Get user's favorite video IDs
- `GET /api/favorites/user/{userId}/videos` - Get user's favorite videos with details
- `POST /api/favorites/video/{videoId}/user/{userId}/toggle` - Toggle favorite status

## Getting Started

### 1. Using Mock Data (No Backend Required)
```bash
# Just start the React app
npm run dev
```

### 2. Using Backend API
```bash
# Terminal 1: Start the backend API
cd ../youtube-clone-api
npm run dev

# Terminal 2: Configure and start frontend
# 1. Edit src/config/api.ts and set USE_API: true
# 2. Start the React app
npm run dev
```

## User Management

Currently uses a simple default user ID (`user-123`). In a production app, this would be replaced with proper authentication and user management.

## Error Handling

The app gracefully handles:
- Network connectivity issues
- API server downtime  
- Invalid API responses
- CORS errors

All errors are logged to the console, and the app falls back to mock data to ensure a good user experience.

## Development Tips

1. **Start with mock data** to develop UI features
2. **Switch to API mode** to test backend integration
3. **Use the data source indicator** to verify which mode you're in
4. **Check browser console** for API error details
5. **Test offline scenarios** by stopping the backend server 