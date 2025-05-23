# YouTube Clone API

A RESTful API server built with Express.js, TypeScript, and SQLite to support the YouTube Clone frontend application.

## Features

- **Videos API**: CRUD operations for video data
- **Favorites API**: Manage user favorites with persistent storage
- **Search**: Filter videos by title or channel name
- **SQLite Database**: Lightweight, file-based database with automatic initialization
- **TypeScript**: Full type safety and IntelliSense support
- **CORS Enabled**: Ready for frontend integration

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **The API will be available at:**
   - Main API: `http://localhost:3001`
   - Health check: `http://localhost:3001/health`

## API Endpoints

### Videos

- `GET /api/videos` - Get all videos
- `GET /api/videos?search=query` - Search videos by title or channel
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Favorites

- `GET /api/favorites/:userId` - Get user's favorite video IDs
- `GET /api/favorites/:userId/videos` - Get user's favorite videos (full details)
- `GET /api/favorites/:userId/count` - Get user's favorite count
- `POST /api/favorites/:userId/:videoId/toggle` - Toggle favorite status
- `POST /api/favorites/:userId/:videoId` - Add to favorites
- `DELETE /api/favorites/:userId/:videoId` - Remove from favorites
- `GET /api/favorites/:userId/:videoId/check` - Check if video is favorited

## Example API Responses

### Get All Videos
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "Amazing Nature Documentary 2024",
      "thumbnailUrl": "https://picsum.photos/320/180?random=1",
      "channelName": "Nature Channel",
      "viewCount": "1.2M",
      "timestamp": "2 weeks ago",
      "duration": "12:45",
      "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Toggle Favorite
```json
{
  "success": true,
  "data": {
    "isFavorite": true,
    "message": "Added to favorites"
  },
  "message": "Added to favorites"
}
```

## Database Schema

### Videos Table
```sql
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  channelName TEXT NOT NULL,
  viewCount TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  duration TEXT NOT NULL,
  videoUrl TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  videoId TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (videoId) REFERENCES videos (id) ON DELETE CASCADE,
  UNIQUE(userId, videoId)
);
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run init-db` - Initialize database (runs automatically on server start)

## Environment Variables

Create a `.env` file with:
```
PORT=3001
NODE_ENV=development
DB_PATH=./database/youtube_clone.db
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── database/        # Database connection
├── models/          # Data models and database operations
├── routes/          # Express routes
├── scripts/         # Database initialization
├── types/           # TypeScript type definitions
└── server.ts        # Main server file
```

## Integration with Frontend

This API is designed to work with the YouTube Clone React frontend. To integrate:

1. Start this API server on port 3001
2. Update your React app to use `http://localhost:3001/api` as the base URL
3. Use the provided endpoints to fetch videos and manage favorites

## Production Deployment

1. Build the project: `npm run build`
2. Set environment variables for production
3. Run: `npm start`
4. The SQLite database file will be created automatically

## Technology Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite3** - Database
- **UUID** - Unique ID generation
- **CORS** - Cross-origin requests
- **Nodemon** - Development auto-reload 