# 27 Added all playlist routes and 7 controllers for it

## Playlist Controllers Documentation

---

### 1. Create Playlist

This controller function is responsible for creating a new playlist. It validates the incoming data, ensures the uniqueness of the playlist name for the user's playlists, and then saves the playlist to the database.

### HTTP Method: POST

- **Route**: `/api/v1/playlists`

### Request Body

- **name** (Required): The name of the playlist.
- **description** (Required): Description of the playlist.

### Error Handling

- If there are validation errors in the request body, a `400` status with a validation error message is returned.
- If the playlist name is not unique for the user's playlists, a `400` status with an error message indicating that the user already has another playlist with the same name is returned.
- If there is an error during playlist creation or saving to the database, a `500` status with an internal server error message is returned.

### Success Response

- If the playlist is created successfully, a `201` status with a success message and the created playlist object is returned.

### Example Usage

```json
POST /api/v1/playlists
{
  "name": "My Playlist",
  "description": "A collection of my favorite videos"
}

```

### Example Response

```json
{
  "statusCode": 201,
  "message": "Playlist Created Successfully",
  "data": {
    "_id": "612a319a72cfb53498d42dc5",
    "name": "My Playlist",
    "description": "A collection of my favorite videos",
    "owner": "612a319a72cfb53498d42dc4",
    "createdAt": "2022-08-28T12:00:00.000Z",
    "updatedAt": "2022-08-28T12:00:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Validation Error, Playlist name already exists.
- `500`: Internal Server Error, Playlist creation failed.

---

### 2. Get User Playlists

This controller function retrieves playlists belonging to a specific user. It fetches user playlists using aggregation pipelines and returns them as a response.

### HTTP Method: GET

- **Route**: `/api/v1/playlists/user/:userId`

### Request Parameters

- **userId**: The ID of the user whose playlists are to be fetched.

### Error Handling

- If the user ID is missing or invalid, a `400` status with an error message indicating the correct user ID is required is returned.
- If there is an error while fetching user playlists, a `500` status with an internal server error message is returned.

### Success Response

- If user playlists are fetched successfully, a `201` status with a success message and an array of user playlists is returned. If the user has no playlists, a success message indicating that the user has zero playlists is returned.

### Example Usage

```json
GET /api/v1/playlists/user/612a319a72cfb53498d42dc4

```

### Example Response (User has playlists)

```json
{
  "statusCode": 201,
  "message": "User Playlists Fetched Successfully",
  "data": [
    {
      "_id": "612a319a72cfb53498d42dc5",
      "name": "My Playlist",
      "description": "A collection of my favorite videos",
      "owner": "612a319a72cfb53498d42dc4",
      "createdAt": "2022-08-28T12:00:00.000Z",
      "updatedAt": "2022-08-28T12:00:00.000Z",
      "__v": 0
    },
    {
      "_id": "612a319a72cfb53498d42dc6",
      "name": "Workout Playlist",
      "description": "Playlist for workout sessions",
      "owner": "612a319a72cfb53498d42dc4",
      "createdAt": "2022-08-28T12:00:00.000Z",
      "updatedAt": "2022-08-28T12:00:00.000Z",
      "__v": 0
    }
  ]
}

```

### Example Response (User has zero playlists)

```json
{
  "statusCode": 201,
  "message": "User Has Zero Playlists",
  "data": []
}

```

### Possible Errors

- `400`: Correct userId is required.
- `500`: Internal Server Error, Failed to fetch user playlists.

---

### 3. Get Playlist by ID

This controller function retrieves a playlist by its unique identifier (ID). It fetches the playlist from the database using the provided ID and returns it as a response.

### HTTP Method: GET

- **Route**: `/api/v1/playlists/:playlistId`

### Request Parameters

- **playlistId**: The unique identifier of the playlist to be fetched.

### Error Handling

- If the playlist ID is missing or invalid, a `400` status with an error message indicating the correct playlist ID is required is returned.
- If the playlist is not found in the database, a `400` status with an error message indicating that the playlist was not found is returned.
- If there is an error while fetching the playlist, a `500` status with an internal server error message is returned.

### Success Response

- If the playlist is fetched successfully, a `201` status with a success message and the playlist object is returned.

### Example Usage

```json
GET /api/v1/playlists/612a319a72cfb53498d42dc5

```

### Example Response (Playlist Found)

```json
{
  "statusCode": 201,
  "message": "Playlist Fetched Successfully",
  "data": {
    "_id": "612a319a72cfb53498d42dc5",
    "name": "My Playlist",
    "description": "A collection of my favorite videos",
    "owner": "612a319a72cfb53498d42dc4",
    "createdAt": "2022-08-28T12:00:00.000Z",
    "updatedAt": "2022-08-28T12:00:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Correct playlistId is required, Playlist not found in the database.
- `500`: Internal Server Error, Failed to fetch playlist by ID.

---

### 4. Add Video to Playlist

This controller function adds a video to a specified playlist. It first validates the provided playlist ID and checks if the playlist exists in the database. Then, it updates the playlist document by adding the new video to its list of videos.

### HTTP Method: PATCH

- **Route**: `/api/v1/playlists/add/:videoId/:playlistId`

### Request Parameters

- **playlistId**: The unique identifier of the playlist to which the video will be added.
- **videoId**: The unique identifier of the video to be added to the playlist.

### Error Handling

- If the playlist ID is missing or invalid, a `400` status with an error message indicating the correct playlist ID is required is returned.
- If the playlist does not exist in the database, a `400` status with an error message indicating that the playlist does not exist is returned.
- If there is an error while adding the video to the playlist, a `500` status with an internal server error message is returned.

### Success Response

- If the video is successfully added to the playlist, a `201` status with a success message and the updated playlist object (including the added video) is returned.

### Example Usage

```json
PATCH /api/v1/playlists/add/612a319a72cfb53498d42dc5/60f5a8ca4fa2df06b0d0352f

```

### Example Response (Video Added)

```json
{
  "statusCode": 201,
  "message": "Video Added To Playlist Successfully",
  "data": {
    "_id": "612a319a72cfb53498d42dc5",
    "name": "My Playlist",
    "description": "A collection of my favorite videos",
    "owner": "612a319a72cfb53498d42dc4",
    "video": [
      "60f5a8ca4fa2df06b0d0352f"
    ],
    "createdAt": "2022-08-28T12:00:00.000Z",
    "updatedAt": "2022-08-28T12:05:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Correct playlistId is required, Playlist does not exist in the database.
- `500`: Internal Server Error, Failed to add video to playlist.

---

### 5. Remove Video from Playlist

This controller function removes a video from a specified playlist. It first validates the provided playlist ID and checks if the playlist exists in the database. Then, it updates the playlist document by removing the specified video from its list of videos.

### HTTP Method: PATCH

- **Route**: `/api/v1/playlists/remove/:videoId/:playlistId`

### Request Parameters

- **playlistId**: The unique identifier of the playlist from which the video will be removed.
- **videoId**: The unique identifier of the video to be removed from the playlist.

### Error Handling

- If the playlist ID is missing or invalid, a `400` status with an error message indicating the correct playlist ID is required is returned.
- If the playlist does not exist in the database, a `400` status with an error message indicating that the playlist does not exist is returned.
- If there is an error while removing the video from the playlist, a `500` status with an internal server error message is returned.

### Success Response

- If the video is successfully removed from the playlist, a `201` status with a success message and the updated playlist object (without the removed video) is returned.

### Example Usage

```json
PATCH /api/v1/playlists/remove/60f5a8ca4fa2df06b0d0352f/612a319a72cfb53498d42dc5

```

### Example Response (Video Removed)

```json
{
  "statusCode": 201,
  "message": "Video Removed From Playlist Successfully",
  "data": {
    "_id": "612a319a72cfb53498d42dc5",
    "name": "My Playlist",
    "description": "A collection of my favorite videos",
    "owner": "612a319a72cfb53498d42dc4",
    "video": [],
    "createdAt": "2022-08-28T12:00:00.000Z",
    "updatedAt": "2022-08-28T12:05:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Correct playlistId is required, Playlist does not exist in the database.
- `500`: Internal Server Error, Failed to remove video from playlist.

---

### 6. Delete Playlist

This controller function deletes a playlist from the database. It first validates the provided playlist ID and checks if the playlist exists in the database. Then, it deletes the playlist document.

### HTTP Method: DELETE

- **Route**: `/api/v1/playlists/:playlistId`

### Request Parameters

- **playlistId**: The unique identifier of the playlist to be deleted.

### Error Handling

- If the playlist ID is missing or invalid, a `400` status with an error message indicating the correct playlist ID is required is returned.
- If the playlist does not exist in the database, a `400` status with an error message indicating that the playlist does not exist is returned.
- If there is an error while deleting the playlist, a `500` status with an internal server error message is returned.

### Success Response

- If the playlist is successfully deleted, a `201` status with a success message and the deleted playlist object is returned.

### Example Usage

```json
DELETE /api/v1/playlists/60f5a8ca4fa2df06b0d0352f

```

### Example Response (Playlist Deleted)

```json
{
  "statusCode": 201,
  "message": "Playlist Deleted Successfully",
  "data": {
    "_id": "60f5a8ca4fa2df06b0d0352f",
    "name": "My Playlist",
    "description": "A collection of my favorite videos",
    "owner": "612a319a72cfb53498d42dc4",
    "video": ["612a319a72cfb53498d42dc5", "612a319a72cfb53498d42dc6"],
    "createdAt": "2022-08-01T12:00:00.000Z",
    "updatedAt": "2022-08-10T15:30:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Correct playlistId is required, Playlist does not exist in the database.
- `500`: Internal Server Error, Failed to delete the playlist.

---

### 7. Update Playlist

This controller function updates the details of a playlist in the database. It first validates the provided playlist ID and the request body for any validation errors. Then, it checks if the playlist exists in the database. Afterward, it ensures that the updated playlist's name is unique among the playlists owned by the user.

### HTTP Method: PATCH

- **Route**: `/api/v1/playlists/:playlistId`

### Request Parameters

- **playlistId**: The unique identifier of the playlist to be updated.

### Request Body

- **name**: The updated name of the playlist.
- **description**: The updated description of the playlist.

### Error Handling

- If the playlist ID is missing or invalid, a `400` status with an error message indicating the correct playlist ID is required is returned.
- If there are validation errors in the request body, a `400` status with a validation error message is returned.
- If the playlist does not exist in the database, a `400` status with an error message indicating that the playlist does not exist is returned.
- If the updated playlist's name is not unique among the playlists owned by the user, a `400` status with an error message indicating that a playlist with the same name already exists is returned.
- If there is an error while updating the playlist, a `500` status with an internal server error message is returned.

### Success Response

- If the playlist is successfully updated, a `201` status with a success message and the updated playlist object is returned.

### Example Usage

```json
PATCH /api/v1/playlists/60f5a8ca4fa2df06b0d0352f
{
  "name": "New Playlist Name",
  "description": "Updated playlist description"
}

```

### Example Response (Playlist Updated)

```json
{
  "statusCode": 201,
  "message": "Playlist Updated Successfully",
  "data": {
    "_id": "60f5a8ca4fa2df06b0d0352f",
    "name": "New Playlist Name",
    "description": "Updated playlist description",
    "owner": "612a319a72cfb53498d42dc4",
    "video": ["612a319a72cfb53498d42dc5", "612a319a72cfb53498d42dc6"],
    "createdAt": "2022-08-01T12:00:00.000Z",
    "updatedAt": "2022-08-10T15:30:00.000Z",
    "__v": 0
  }
}

```

### Possible Errors

- `400`: Correct playlistId is required, Playlist does not exist in the database, Validation error, Playlist with the same name already exists.
- `500`: Internal Server Error, Failed to update the playlist.

---