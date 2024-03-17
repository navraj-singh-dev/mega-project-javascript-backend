# 26 Added new routes & 5 new controllers and a middleware for “video.controller.js”

## Explaining All Controllers:

### 1. Controller Documentation: getAllVideos

This controller handles the retrieval of videos based on various criteria such as user ID, search query, sorting, pagination, and limit.

### Route

```
GET /api/v1/videos

```

### Parameters

- **userId**: (Required) The ID of the user whose videos are to be fetched.
- **query**: (Optional) A search query to filter videos by title or description.
- **sortBy**: (Optional) Field to sort videos by, e.g., "views" or "createdAt".
- **sortType**: (Optional) Sort order, either "asc" (ascending) or "desc" (descending).
- **limit**: (Optional) Number of videos to fetch per page (default is 10).
- **page**: (Optional) Page number to fetch (default is 1).

### Response

- **videos**: Array of video documents matching the specified criteria.
- **paginate**: Pagination data including current page, total pages, limit, and total videos.

### Error Handling

- If the provided userId is missing or invalid, a 400 Bad Request error is returned.
- If an internal server error occurs during the process, a 500 Internal Server Error is returned.

### Example

```
GET /api/v1/videos?userId=123&query=example&sortBy=views&sortType=desc&limit=10&page=1

```

```json
{
  "success": true,
  "message": "All Videos Fetched Successfully",
  "data": {
    "videos": [...],
    "paginate": {
      "currentPage": 1,
      "totalPages": 10,
      "limit": 10,
      "totalVideos": 100
    }
  }
}

```

### Notes

- Pagination is used for efficient retrieval of videos, especially when dealing with large datasets.
- The controller supports searching, sorting, and filtering of videos to provide a response based on user’s demands.
- Error handling is implemented to handle cases where invalid input or internal server errors occur during the execution of controller.

---

### 2. Controller Documentation: getVideoById

This controller retrieves a specific video by its ID.

### Route

```
GET /api/v1/videos/:videoId

```

### Parameters

- **videoId**: (Required) The ID of the video to fetch.

### Middleware

- **fetchVideoById**: Middleware function that fetches the video from the database based on the provided video ID.

### Response

- If the video is found successfully, it is returned in the response body.
- The response includes the video document with details such as title, description, owner, etc.

### Error Handling

- If the video is not found or an internal server error occurs, an appropriate error response is returned.

### Example

```
GET /api/v1/videos/123456789

```

```json
{
  "success": true,
  "message": "Video Found Successfully",
  "data": {
    "_id": "123456789",
    "title": "Example Video",
    "description": "This is an example video",
    "owner": "user123",
    "thumbnail": "<https://example.com/thumbnail.jpg>",
    "createdAt": "2022-03-14T12:00:00Z",
    "updatedAt": "2022-03-15T10:30:00Z"
  }
}
```

---

### 3. Controller Documentation: updateVideo

This controller updates the details of a specific video, including its title, description, and thumbnail.

### Route

```
PATCH /api/v1/videos/:videoId

```

### Parameters

- **videoId**: (Required) The ID of the video to update.

### Middleware

- **fetchVideoById**: Middleware function that fetches the video from the database based on the provided video ID.
- **upload.single("thumbnail")**: Middleware to handle the upload of a single thumbnail file.
- **Express Validator**: Validation middleware to ensure that the request body contains the required fields (`title`, `description`) and that the thumbnail file is provided.

### Request Body

- **title**: (Required) The updated title of the video.
- **description**: (Required) The updated description of the video.

### Response

- If the video is updated successfully, the updated video details are returned in the response body.
- The response includes the updated video document with details such as title, description, thumbnail URL, etc.

### Error Handling

- If the request body does not pass validation checks, a 400 Bad Request error is returned with details of the validation errors.
- If the video update is unsuccessful or an internal server error occurs, an appropriate error response is returned.

### Example

```
PATCH /api/v1/videos/123456789

```

Request Body:

```json
{
  "title": "Updated Title",
  "description": "Updated Description"
}

```

Response:

```json
{
  "success": true,
  "message": "Video Updated Successfully",
  "data": {
    "_id": "123456789",
    "title": "Updated Title",
    "description": "Updated Description",
    "thumbnail": "<https://example.com/updated-thumbnail.jpg>",
    "createdAt": "2022-03-14T12:00:00Z",
    "updatedAt": "2022-03-15T11:00:00Z"
  }
}

```

---

### 4. Controller Documentation: deleteVideo

This controller deletes a specific video from the database.

### Route

```
DELETE /api/v1/videos/:videoId

```

### Parameters

- **videoId**: (Required) The ID of the video to delete.

### Middleware

- **fetchVideoById**: Middleware function that fetches the video from the database based on the provided video ID.

### Response

- If the video is deleted successfully, a success message is returned in the response body.
- The response includes the details of the deleted video, such as its ID, title, description, etc.

### Error Handling

- If the video deletion is unsuccessful or an internal server error occurs, an appropriate error response is returned.

### Example

```
DELETE /api/v1/videos/123456789

```

Response:

```json
{
  "success": true,
  "message": "Video Deleted Successfully",
  "data": {
    "_id": "123456789",
    "title": "Deleted Video",
    "description": "This video has been deleted",
    "thumbnail": "<https://example.com/deleted-thumbnail.jpg>",
    "createdAt": "2022-03-14T12:00:00Z",
    "updatedAt": "2022-03-15T11:00:00Z"
  }
}

```

---

### 5. Controller Documentation: togglePublishStatus

This controller toggles the publish status of a specific video, changing it between published and unpublished states.

### Route

```
PATCH /api/v1/videos/toggle/:videoId
```

### Parameters

- **videoId**: (Required) The ID of the video to toggle the publish status.

### Middleware

- **fetchVideoById**: Middleware function that fetches the video from the database based on the provided video ID.

### Logic

- Checks the current publish status of the video.
- If the video is currently published, it updates the `isPublished` field to `false` to unpublish it.
- If the video is currently unpublished, it updates the `isPublished` field to `true` to publish it.
- The updated video document is returned in the response.

### Response

- If the publish status is toggled successfully, a success message is returned in the response body.
- The response includes the details of the toggled video, such as its ID, title, description, publish status, etc.

### Error Handling

- If the toggle operation is unsuccessful or an internal server error occurs, an appropriate error response is returned.

### Example

```
PATCH /api/v1/videos/123456789/toggle-publish

```

Response:

```json
{
  "success": true,
  "message": "Publish Status Toggled Successfully",
  "data": {
    "_id": "123456789",
    "title": "Example Video",
    "description": "This is an example video",
    "isPublished": false,
    "createdAt": "2022-03-14T12:00:00Z",
    "updatedAt": "2022-03-15T11:00:00Z"
  }
}

```

---