# VideoTube API

A robust backend API for a video-sharing platform, built with Node.js, Express, MongoDB, Mongoose and more.

## DB Diagram & Structure
[Models Link](https://app.eraser.io/workspace/gddHmHCiWzarE75BKVjB?origin=share)

## Project Structure

- `index.js`: Entry point of the application
- `models/`: Database schemas
- `app.js`: Express application setup and middleware configuration
- `middlewares/`: Custom middleware functions
- `routes/`: API route definitions
- `controllers/`: Request handlers for each route
- `utils/`: Utility functions and helpers

## API Routes

### User Routes
- **POST** `/api/v1/users/register` - Register a new user
- **POST** `/api/v1/users/login` - Login user
- **POST** `/api/v1/users/logout` - Logout user
- **POST** `/api/v1/users/regenerate-tokens` - Regenerate access and refresh tokens
- **GET** `/api/v1/users/get-current-user` - Get current user details
- **PATCH** `/api/v1/users/update-user-fullname` - Update user's full name
- **PATCH** `/api/v1/users/update-user-password` - Update user's password
- **PATCH** `/api/v1/users/update-user-avatar` - Update user's avatar
- **PATCH** `/api/v1/users/update-user-coverImage` - Update user's cover image
- **GET** `/api/v1/users/channel/:channelName` - Get channel profile details
- **GET** `/api/v1/users/get-watch-history` - Get user's watch history

### Video Routes
- **GET** `/api/v1/videos` - Get all videos
- **POST** `/api/v1/videos/publish-video` - Publish a new video
- **GET** `/api/v1/videos/:videoId` - Get a specific video
- **PATCH** `/api/v1/videos/:videoId` - Update a video
- **DELETE** `/api/v1/videos/:videoId` - Delete a video
- **PATCH** `/api/v1/videos/toggle/:videoId` - Toggle video publish status

### Playlist Routes
- **POST** `/api/v1/playlist` - Create a new playlist
- **GET** `/api/v1/playlist/:playlistId` - Get a specific playlist
- **PATCH** `/api/v1/playlist/:playlistId` - Update a playlist
- **DELETE** `/api/v1/playlist/:playlistId` - Delete a playlist
- **PATCH** `/api/v1/playlist/add/:videoId/:playlistId` - Add a video to a playlist
- **PATCH** `/api/v1/playlist/remove/:videoId/:playlistId` - Remove a video from a playlist
- **GET** `/api/v1/playlist/user/:userId` - Get all playlists of a user

### Comment Routes
- **GET** `/api/v1/comments/:videoId` - Get all comments for a video
- **POST** `/api/v1/comments/:videoId` - Add a comment to a video
- **PATCH** `/api/v1/comments/c/:commentId` - Update a comment
- **DELETE** `/api/v1/comments/c/:commentId` - Delete a comment

### Tweet Routes
- **POST** `/api/v1/tweets` - Create a new tweet
- **GET** `/api/v1/tweets/user/:userId` - Get user tweets
- **PATCH** `/api/v1/tweets/:tweetId` - Update a tweet
- **DELETE** `/api/v1/tweets/:tweetId` - Delete a tweet

## Key Features

- JWT-based authentication
- File uploads (video and images) using Cloudinary
- MongoDB database with Mongoose ORM
- Express-validator for request validation
- Custom error handling and API responses

## Models

- User
- Video
- Playlist
- Comment
- Tweet

## Middleware

- `auth.middleware.js`: JWT verification
- `multer.middleware.js`: File upload handling
- `video.middleware.js`: Video-specific operations

## Controllers

Controllers handle the business logic for each route, including:
- User management
- Video operations
- Playlist management
- Comment handling
- Tweet functionality

## Utils

- `apiError.js`: Custom error class
- `apiResponse.js`: Standardized API response format
- `asyncHandler.js`: Async function wrapper for error handling
- `cloudinary.js`: Cloudinary configuration and upload function

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the server: `npm run dev`

## Note

This API requires authentication for most routes. Ensure you include the JWT token in the Authorization header for protected routes.

---

# mega-project-javascript-backend (Old ReadME)

- Continuation of repository [series-javascript-backend](https://github.com/navraj-singh-dev/series-javascript-backend).
- This repository is seperated from "series-javascript-backend" and maintained independently.
  Reason: this a complex backend project which will be timelined & maintained seperately.
- This is a backend project which implements only `industry standard` techniques.

# What's Here:

- This project implements backend as given in the link:
  - [Models Link](https://app.eraser.io/workspace/gddHmHCiWzarE75BKVjB?origin=share)
  - Please click on the link to see what this backend project accomplish.
- This backend is inspired from most popular app called "YouTube".
- Many Schemas, Models, Controllers, Custom API Error & API Response Classes for standardization,
  API testing using postman, JWT Authentication, Bcrypt Password Hashing, Custom Made and Express-Validator Package For Input Data & Schema Validation,
  Access Tokens & Refresh Tokens, MongoDB Aggregation Pipelines & Sub Pipelines, File Upload Using Multer Package & Cloudinary, Mongoose Hooks,
  Detailed and well written documentation for each commit i made and each learning and accomplishments i got while making this project,
  Industry standard practices followed only, Best practices followed only, Build in Public & Learn In Public by sharing project's insights and progress on Twitter, Following open-source, Etc.
  All of these are included in this backend project.

# About documentation of each commit on GitHub & learnings and accomplishments from this complete project

- Every commit is well documeted and explained in depths of details. Please go to "learnings from this project" folder.
- Please open the folder called "learnings from this project".
- It contains the markdown files which explain all the learnings i got and accomplishments i achieved throughout this project at a certain instance during this project.
- All the documentation is beautifully formatted for extra ease.
- This way other people will also learn and my documentation will surely save other developers time.
