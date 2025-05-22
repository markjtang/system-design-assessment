# Database Schema: `youtube_clone_db`

This document outlines the database schema for the YouTube clone platform, designed using PostgreSQL, focusing on core features for an MVP.

## Core Data Entities & Their Key Attributes (Summary for Interview)

1.  **User**
    *   **Purpose:** Represents individuals interacting with the platform.
    *   **Key Relationships:**
        *   One-to-Many with **Video** (uploader)
        *   One-to-Many with **Comment** (commenter)
        *   One-to-Many with **VideoReaction** (reactor)

2.  **Video**
    *   **Purpose:** Represents the video content and its associated metadata.
    *   **Key Relationships:**
        *   Many-to-One with **User**
        *   One-to-Many with **Comment**
        *   One-to-Many with **VideoReaction**

3.  **Comment**
    *   **Purpose:** User-generated textual feedback on videos.
    *   **Key Relationships:**
        *   Many-to-One with **Video**
        *   Many-to-One with **User**
        *   Many-to-One with **Comment** (self-referential for replies)

4.  **VideoReaction**
    *   **Purpose:** Tracks specific user reactions (e.g., like, dislike) to a video.
    *   **Key Relationships:**
        *   Many-to-One with **Video**
        *   Many-to-One with **User**

---

## Detailed Table Structures

### 1. Table: `users`

Stores information about registered users.

| Column Name           | Data Type     | Constraints & Notes                                       |
| :-------------------- | :------------ | :-------------------------------------------------------- |
| `user_id`             | `UUID`        | Primary Key, Default: `gen_random_uuid()`                 |
| `username`            | `VARCHAR(50)` | Unique, Not Null, Indexed                                 |
| `email`               | `VARCHAR(255)`| Unique, Not Null, Indexed                                 |
| `password_hash`       | `VARCHAR(255)`| Not Null                                                  |
| `profile_picture_url` | `TEXT`        | Nullable (URL to image on S3/CDN)                         |
| `channel_name`        | `VARCHAR(100)`| Nullable, potentially Unique, Indexed. User's public name.|
| `channel_description` | `TEXT`        | Nullable                                                  |
| `created_at`          | `TIMESTAMPTZ` | Not Null, Default: `NOW()`                                |
| `updated_at`          | `TIMESTAMPTZ` | Not Null, Default: `NOW()` (use trigger to auto-update)   |

---

### 2. Table: `videos`

Stores metadata for each uploaded video.

| Column Name                 | Data Type     | Constraints & Notes                                                                |
| :-------------------------- | :------------ | :--------------------------------------------------------------------------------- |
| `video_id`                  | `UUID`        | Primary Key, Default: `gen_random_uuid()`                                          |
| `user_id`                   | `UUID`        | Not Null, Foreign Key (`users.user_id`), Indexed (uploader)                        |
| `title`                     | `VARCHAR(255)`| Not Null, Indexed (for basic search)                                               |
| `description`               | `TEXT`        | Nullable                                                                           |
| `thumbnail_url`             | `TEXT`        | Nullable (URL to S3/CDN image)                                                     |
| `raw_s3_key`                | `TEXT`        | Not Null, Unique (key for original uploaded file in S3)                            |
| `processed_s3_manifest_key` | `TEXT`        | Nullable (key for HLS/DASH manifest in S3 for processed video)                     |
| `duration_seconds`          | `INTEGER`     | Nullable (video length)                                                            |
| `status`                    | `VARCHAR(20)` | Not Null, Default: `'PENDING'`, Indexed (e.g., `PENDING`, `PROCESSING`, `PUBLISHED`, `FAILED`, `DELETED`) |
| `visibility`                | `VARCHAR(20)` | Not Null, Default: `'PRIVATE'`, Indexed (e.g., `PUBLIC`, `PRIVATE`, `UNLISTED`)    |
| `view_count`                | `BIGINT`      | Not Null, Default: 0                                                               |
| `like_count`                | `INTEGER`     | Not Null, Default: 0 (denormalized counter)                                        |
| `dislike_count`             | `INTEGER`     | Not Null, Default: 0 (denormalized counter)                                        |
| `uploaded_at`               | `TIMESTAMPTZ` | Not Null, Default: `NOW()` (when metadata entry is created/upload starts)          |
| `published_at`              | `TIMESTAMPTZ` | Nullable (when video becomes `PUBLIC`)                                             |
| `updated_at`                | `TIMESTAMPTZ` | Not Null, Default: `NOW()` (use trigger to auto-update)                            |

---

### 3. Table: `comments`

Stores comments made by users on videos.

| Column Name         | Data Type     | Constraints & Notes                                                   |
| :------------------ | :------------ | :-------------------------------------------------------------------- |
| `comment_id`        | `UUID`        | Primary Key, Default: `gen_random_uuid()`                             |
| `video_id`          | `UUID`        | Not Null, Foreign Key (`videos.video_id`), Indexed                    |
| `user_id`           | `UUID`        | Not Null, Foreign Key (`users.user_id`), Indexed                      |
| `parent_comment_id` | `UUID`        | Nullable, Foreign Key (`comments.comment_id`), Indexed (for replies)  |
| `text`              | `TEXT`        | Not Null                                                              |
| `created_at`        | `TIMESTAMPTZ` | Not Null, Default: `NOW()`                                            |
| `updated_at`        | `TIMESTAMPTZ` | Not Null, Default: `NOW()` (use trigger to auto-update)               |
| `deleted_at`        | `TIMESTAMPTZ` | Nullable (for soft deletes)                                           |


---

### 4. Table: `video_reactions`

Tracks user likes/dislikes on videos. This allows a user to change their reaction.

| Column Name     | Data Type     | Constraints & Notes                                               |
| :-------------- | :------------ | :---------------------------------------------------------------- |
| `reaction_id`   | `UUID`        | Primary Key, Default: `gen_random_uuid()`                         |
| `video_id`      | `UUID`        | Not Null, Foreign Key (`videos.video_id`)                         |
| `user_id`       | `UUID`        | Not Null, Foreign Key (`users.user_id`)                           |
| `reaction_type` | `VARCHAR(10)` | Not Null, Indexed (e.g., `'LIKE'`, `'DISLIKE'`)                   |
| `created_at`    | `TIMESTAMPTZ` | Not Null, Default: `NOW()`                                        |
| `updated_at`    | `TIMESTAMPTZ` | Not Null, Default: `NOW()` (use trigger to auto-update)           |

