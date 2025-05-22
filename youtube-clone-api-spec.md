# YouTube Clone API Specification

## Overview

This API specification defines the endpoints for the YouTube Clone video sharing platform. The API is designed to support core video sharing functionality for 20,000-50,000 Daily Active Users across Canada and Europe.

### Base URL
```
https://api.yourtube.com/v1
```

### Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Content Types
- Request: `application/json`
- Response: `application/json`

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "johndoe",
  "displayName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-user-id",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "user@example.com",
    "createdAt": "2025-05-22T10:00:00Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/login
Authenticate and receive access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-user-id",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### POST /auth/logout
Logout and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

---

## User Endpoints

### GET /users/profile
Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "uuid-user-id",
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "user@example.com",
  "bio": "Video creator and enthusiast",
  "avatarUrl": "https://cdn.yourtube.com/avatars/uuid.jpg",
  "createdAt": "2025-05-22T10:00:00Z",
  "stats": {
    "videoCount": 42,
    "totalViews": 150000,
    "subscriberCount": 1200
  }
}
```

### PUT /users/profile
Update authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "displayName": "John Doe Updated",
  "bio": "Updated bio text"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-user-id",
  "username": "johndoe",
  "displayName": "John Doe Updated",
  "bio": "Updated bio text",
  "updatedAt": "2025-05-22T11:00:00Z"
}
```

### GET /users/{userId}
Get public user profile by ID.

**Response (200 OK):**
```json
{
  "id": "uuid-user-id",
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "Video creator and enthusiast",
  "avatarUrl": "https://cdn.yourtube.com/avatars/uuid.jpg",
  "createdAt": "2025-05-22T10:00:00Z",
  "stats": {
    "videoCount": 42,
    "subscriberCount": 1200
  }
}
```

---

## Video Endpoints

### GET /videos
Get paginated list of videos.

**Query Parameters:**
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page
- `sort` (string, default: "recent"): Sort order (recent, popular, views)
- `category` (string, optional): Filter by category
- `search` (string, optional): Search query

**Response (200 OK):**
```json
{
  "videos": [
    {
      "id": "uuid-video-id",
      "title": "Amazing Video Title",
      "description": "This is a great video about...",
      "thumbnailUrl": "https://cdn.yourtube.com/thumbnails/uuid.jpg",
      "duration": 305,
      "viewCount": 1523,
      "likeCount": 89,
      "uploadedAt": "2025-05-20T15:30:00Z",
      "category": "technology",
      "user": {
        "id": "uuid-user-id",
        "username": "johndoe",
        "displayName": "John Doe",
        "avatarUrl": "https://cdn.yourtube.com/avatars/uuid.jpg"
      },
      "status": "published"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "totalPages": 13
  }
}
```

### GET /videos/{videoId}
Get detailed video information.

**Response (200 OK):**
```json
{
  "id": "uuid-video-id",
  "title": "Amazing Video Title",
  "description": "This is a detailed description of the video...",
  "thumbnailUrl": "https://cdn.yourtube.com/thumbnails/uuid.jpg",
  "duration": 305,
  "viewCount": 1523,
  "likeCount": 89,
  "dislikeCount": 5,
  "uploadedAt": "2025-05-20T15:30:00Z",
  "category": "technology",
  "tags": ["tech", "tutorial", "programming"],
  "user": {
    "id": "uuid-user-id",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatarUrl": "https://cdn.yourtube.com/avatars/uuid.jpg",
    "subscriberCount": 1200
  },
  "videoUrl": "https://cdn.yourtube.com/videos/uuid/playlist.m3u8",
  "resolutions": [
    {
      "quality": "1080p",
      "url": "https://cdn.yourtube.com/videos/uuid/1080p/playlist.m3u8"
    },
    {
      "quality": "720p",
      "url": "https://cdn.yourtube.com/videos/uuid/720p/playlist.m3u8"
    },
    {
      "quality": "480p",
      "url": "https://cdn.yourtube.com/videos/uuid/480p/playlist.m3u8"
    }
  ],
  "status": "published"
}
```

### POST /videos/upload/initiate
Initiate video upload and get presigned URL.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "My New Video",
  "description": "Description of my video",
  "category": "technology",
  "tags": ["tech", "tutorial"],
  "fileName": "video.mp4",
  "fileSize": 104857600
}
```

**Response (200 OK):**
```json
{
  "videoId": "uuid-video-id",
  "uploadUrl": "https://yourtube-raw-videos.s3.amazonaws.com/...",
  "uploadMethod": "PUT",
  "uploadHeaders": {
    "Content-Type": "video/mp4"
  },
  "expiresAt": "2025-05-22T11:30:00Z"
}
```

### POST /videos/{videoId}/complete-upload
Confirm video upload completion and trigger processing.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "uploadSuccess": true
}
```

**Response (200 OK):**
```json
{
  "videoId": "uuid-video-id",
  "status": "processing",
  "message": "Video processing started"
}
```

### PUT /videos/{videoId}
Update video metadata.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Video Title",
  "description": "Updated description",
  "category": "education",
  "tags": ["education", "tutorial", "updated"]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-video-id",
  "title": "Updated Video Title",
  "description": "Updated description",
  "category": "education",
  "tags": ["education", "tutorial", "updated"],
  "updatedAt": "2025-05-22T12:00:00Z"
}
```

### DELETE /videos/{videoId}
Delete a video.

**Headers:** `Authorization: Bearer <token>`

**Response (204 No Content)**

### GET /videos/{videoId}/status
Check video processing status.

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "videoId": "uuid-video-id",
  "status": "processing", // draft, processing, published, failed
  "progress": 75,
  "estimatedCompletionTime": "2025-05-22T12:00:00Z",
  "processingDetails": {
    "currentStep": "transcoding",
    "completedSteps": ["upload", "validation"],
    "remainingSteps": ["transcoding", "thumbnail_generation"]
  }
}
```

---

## User Video Interactions

### POST /videos/{videoId}/favorite
Add video to favorites.

**Headers:** `Authorization: Bearer <token>`

**Response (201 Created):**
```json
{
  "videoId": "uuid-video-id",
  "favoritedAt": "2025-05-22T10:00:00Z"
}
```

### DELETE /videos/{videoId}/favorite
Remove video from favorites.

**Headers:** `Authorization: Bearer <token>`

**Response (204 No Content)**

### GET /users/favorites
Get user's favorite videos.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "favorites": [
    {
      "videoId": "uuid-video-id",
      "favoritedAt": "2025-05-22T10:00:00Z",
      "video": {
        "id": "uuid-video-id",
        "title": "Amazing Video Title",
        "thumbnailUrl": "https://cdn.yourtube.com/thumbnails/uuid.jpg",
        "duration": 305,
        "viewCount": 1523,
        "user": {
          "id": "uuid-user-id",
          "username": "johndoe",
          "displayName": "John Doe"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### POST /videos/{videoId}/view
Record video view (called when user starts watching).

**Headers:** `Authorization: Bearer <token>` (optional)

**Request Body:**
```json
{
  "sessionId": "uuid-session-id",
  "timestamp": 0
}
```

**Response (200 OK):**
```json
{
  "viewId": "uuid-view-id",
  "sessionId": "uuid-session-id"
}
```

### POST /videos/{videoId}/like
Like a video.

**Headers:** `Authorization: Bearer <token>`

**Response (201 Created):**
```json
{
  "videoId": "uuid-video-id",
  "likedAt": "2025-05-22T10:00:00Z"
}
```

### DELETE /videos/{videoId}/like
Remove like from video.

**Headers:** `Authorization: Bearer <token>`

**Response (204 No Content)**

---

## Search Endpoints

### GET /search
Search for videos and users.

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string, default: "all"): Search type (all, videos, users)
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "results": {
    "videos": [
      {
        "id": "uuid-video-id",
        "title": "Matching Video",
        "description": "Description snippet...",
        "thumbnailUrl": "https://cdn.yourtube.com/thumbnails/uuid.jpg",
        "duration": 305,
        "viewCount": 1523,
        "uploadedAt": "2025-05-20T15:30:00Z",
        "user": {
          "username": "johndoe",
          "displayName": "John Doe"
        }
      }
    ],
    "users": [
      {
        "id": "uuid-user-id",
        "username": "matchinguser",
        "displayName": "Matching User",
        "avatarUrl": "https://cdn.yourtube.com/avatars/uuid.jpg",
        "subscriberCount": 500
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

API rate limits are enforced per authenticated user:
- Standard users: 100 requests per minute
- Video uploads: 10 per hour
- Search requests: 30 per minute

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## Webhooks

The API supports webhooks for video processing events. Configure webhook endpoints in your account settings.

### Video Processing Complete
```json
{
  "event": "video.processing.complete",
  "timestamp": "2025-05-22T12:00:00Z",
  "data": {
    "videoId": "uuid-video-id",
    "status": "published",
    "processingTime": 180,
    "resolutions": ["1080p", "720p", "480p"]
  }
}
```

### Video Processing Failed
```json
{
  "event": "video.processing.failed",
  "timestamp": "2025-05-22T12:00:00Z",
  "data": {
    "videoId": "uuid-video-id",
    "error": "Invalid video format",
    "errorCode": "INVALID_FORMAT"
  }
}
```

---

## Notes for Developers

1. **Video Upload Flow**: 
   - Call `/videos/upload/initiate` to get a presigned S3 URL
   - Upload the video file directly to S3 using the presigned URL
   - Call `/videos/{videoId}/complete-upload` to trigger processing
   - Poll `/videos/{videoId}/status` or listen for webhooks to track progress

2. **Pagination**: 
   - All list endpoints support pagination
   - Maximum page size is 100 items
   - Use cursor-based pagination for real-time feeds (future enhancement)

3. **Search**: 
   - Search uses Elasticsearch for full-text search
   - Results are ranked by relevance and recency
   - Search index is updated within 1 minute of changes