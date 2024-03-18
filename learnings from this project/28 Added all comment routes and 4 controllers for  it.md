# 28 Added all comment routes and 4 controllers for it

## Comment Controllers Documentation:

---

### 1. Get All Comments for a Video

This controller function retrieves all comments associated with a specific video.

### Request

- **Method:** GET
- **Endpoint:** `/api/v1/comments/:videoId`

### Query Parameters

- `page` (required): Specifies the page number for pagination.
- `limit` (required): Specifies the maximum number of comments to return per page.

### Path Parameters

- `videoId` (required): The ID of the video for which comments are being retrieved.

### Request Body

This endpoint does not expect any request body.

### Responses

- **200 OK:** Successfully retrieved comments for the specified video. The response includes the following fields:
    - `comments`: An array containing the comments retrieved.
    - `totalCommentsInteger`: The total number of comments for the video.
    - `totalPages`: The total number of pages available based on the specified limit.
    - `currentPage`: The current page number.
- **400 Bad Request:** Indicates a validation error or incorrect input parameters. The response body provides details about the error.
- **500 Internal Server Error:** Indicates an unexpected server error.

### Sample Request

```
GET /api/v1/comments/5fbd09a83149b02fd828dab7?page=1&limit=10

```

### Sample Response

```json
{
  "status": 201,
  "message": "Comments Fetched Successfully",
  "data": {
    "comments": [
      {
        "commentId": "5fc3e32a0c07f637a0ae11fb",
        "content": "Great video!",
        "userId": "5fbdc2fc0c07f637a0ae1193",
        "createdAt": "2022-03-01T10:00:00.000Z"
      },
      {
        "commentId": "5fc3e32a0c07f637a0ae11fc",
        "content": "Nice explanation.",
        "userId": "5fbdc2fc0c07f637a0ae1193",
        "createdAt": "2022-03-01T10:05:00.000Z"
      }
    ],
    "totalCommentsInteger": 25,
    "totalPages": 3,
    "currentPage": 1
  }
}

```

---

### 2. Add a Comment to a Video

This controller function adds a new comment to a specific video.

### Request

- **Method:** POST
- **Endpoint:** `/api/v1/comments/:videoId`

### Path Parameters

- `videoId` (required): The ID of the video to which the comment will be added.

### Request Body

The request body must contain the following fields:

- `content` (required): The content of the comment.

### Responses

- **201 Created:** The comment was successfully added to the video. The response includes the details of the newly added comment.
- **400 Bad Request:** Indicates a validation error or incorrect input parameters. The response body provides details about the error.
- **500 Internal Server Error:** Indicates an unexpected server error.

### Sample Request

```
POST /api/v1/comments/5fbd09a83149b02fd828dab7
Content-Type: application/json

{
  "content": "Great video! Thanks for sharing."
}

```

### Sample Response

```json
{
  "status": 201,
  "message": "Comment Added Successfully",
  "data": {
    "commentId": "5fc3e32a0c07f637a0ae11fb",
    "content": "Great video! Thanks for sharing.",
    "userId": "5fbdc2fc0c07f637a0ae1193",
    "createdAt": "2022-03-01T10:15:00.000Z"
  }
}

```

---

### 3. Update a Comment

This controller function updates an existing comment.

### Request

- **Method:** PATCH
- **Endpoint:** `/api/v1/comments/c/:commentId`

### Path Parameters

- `commentId` (required): The ID of the comment to be updated.

### Request Body

The request body must contain the following field:

- `content` (required): The updated content of the comment.

### Responses

- **201 Created:** The comment was successfully updated. The response includes the details of the updated comment.
- **400 Bad Request:** Indicates a validation error or incorrect input parameters. The response body provides details about the error.
- **500 Internal Server Error:** Indicates an unexpected server error.

### Sample Request

```
PATCH /api/v1/comments/c/5fc3e32a0c07f637a0ae11fb
Content-Type: application/json

{
  "content": "Updated comment content."
}

```

### Sample Response

```json
{
  "status": 201,
  "message": "Comment Updated Successfully",
  "data": {
    "commentId": "5fc3e32a0c07f637a0ae11fb",
    "content": "Updated comment content.",
    "userId": "5fbdc2fc0c07f637a0ae1193",
    "updatedAt": "2022-03-02T09:30:00.000Z"
  }
}

```

---

### 4. Delete a Comment

This controller function deletes an existing comment.

### Request

- **Method:** DELETE
- **Endpoint:** `/api/v1/comments/c/:commentId`

### Path Parameters

- `commentId` (required): The ID of the comment to be deleted.

### Responses

- **201 Created:** The comment was successfully deleted. The response includes the details of the deleted comment.
- **400 Bad Request:** Indicates an incorrect comment ID or the comment does not exist. The response body provides details about the error.
- **500 Internal Server Error:** Indicates an unexpected server error.

### Sample Request

```
DELETE /api/v1/comments/c/5fc3e32a0c07f637a0ae11fb

```

### Sample Response

```json
{
  "status": 201,
  "message": "Comment Deleted Successfully",
  "data": {
    "commentId": "5fc3e32a0c07f637a0ae11fb",
    "content": "This is the deleted comment content.",
    "userId": "5fbdc2fc0c07f637a0ae1193",
    "createdAt": "2022-03-02T09:00:00.000Z",
    "updatedAt": "2022-03-02T09:30:00.000Z"
  }
}

```

---