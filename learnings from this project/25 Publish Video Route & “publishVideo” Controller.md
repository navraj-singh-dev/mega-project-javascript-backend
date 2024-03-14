# 25 Publish Video Route & “publishVideo” Controller

## Controller: publish Video

This controller function `publishVideo` is responsible for handling the request to publish a video. Here's what it does:

1. **Input Validation**: It checks if the required fields, `title` and `description`, are provided in the request body. If not, it returns a 400 status code with an error message.
2. **File Handling**: It extracts the video file and thumbnail from the request if they are provided using multer (a middleware for handling multipart/form-data). It checks if both the video and thumbnail are provided and returns appropriate error messages if not.
3. **Cloudinary Upload**: It uploads the video and thumbnail to Cloudinary, a cloud-based media management service. If the upload is successful, it retrieves the URLs of the uploaded files. If the upload fails, it returns an error message.
4. **Database Operation**: It creates a new video document with the required details including the URLs of the uploaded files, title, description, owner ID (if available), and duration of the video. Then, it saves this document to the database.
5. **Response Handling**: Depending on the outcome of the database operation, it returns appropriate success or error responses along with the corresponding status codes and messages.
6. **Error Handling**: It catches any errors that occur during the process and returns a generic internal server error message along with a 500 status code.

Documentation for this controller should include:

- Purpose: Publish a video with title, description, video file, and thumbnail.
- Method: POST
- Route: /api/v1/videos/publish-video
- Request Body:
    - title: string (required)
    - description: string (required)
    - videoFile: file (required)
    - thumbnail: file (required)
- Response:
    - 201: Video Created Successfully
        - Body: `{ success: true, data: { _id, title, description, videoFile, thumbnail, owner, duration } }`
    - 400: Bad Request
        - Body: `{ success: false, error: "Title and Description is Required" }`
    - 500: Internal Server Error
        - Body: `{ success: false, error: "Internal Server Error" }`
- Error Handling: Validation errors for missing title/description or missing video/thumbnail, upload errors for video/thumbnail, and database save errors.
- Dependencies: Multer for file handling, Cloudinary for file upload, and a MongoDB database for data storage.

---

### Complete Code

```jsx
export const publishVideo = asyncHandler(async (req, res) => {
  try {
    // take title, description from body and validate also
    const { title, description } = req.body;
    if (!title || !description) {
      const videoDataError = new ApiError(
        400,
        "Title and Description is Required",
        [{ msg: "Title and Description is not provided" }]
      );
      return res.status(videoDataError.statusCode).json(videoDataError);
    }

    // take video, thumbnail from multer
    let videoLocalPath;
    let thumbnailLocalPath;

    if (req.files) {
      if (
        Array.isArray(req.files.videoFile) &&
        req.files.videoFile.length > 0
      ) {
        videoLocalPath = req.files.videoFile[0].path;
      }
      if (
        Array.isArray(req.files.thumbnail) &&
        req.files.thumbnail.length > 0
      ) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
      }
    }
    // give error if video or thumbnail not given
    console.log(req.files.videoFile, "\n", req.files.thumbnail);
    if (!req.files.videoFile && !req.files.thumbnail) {
      const filesError = new ApiError(400, "Video and Thumbnail is Required", [
        { msg: "Video and Thumbnail is not provided" },
      ]);
      return res.status(filesError.statusCode).json(filesError);
    }
    if (!req.files.videoFile) {
      const videoError = new ApiError(400, "Video is Required", [
        { msg: "Video is not provided" },
      ]);
      return res.status(videoError.statusCode).json(videoError);
    }
    if (!req.files.thumbnail) {
      const thumbnailError = new ApiError(400, "Thumbnail is Required", [
        { msg: "Thumbnail is not provided" },
      ]);
      return res.status(thumbnailError.statusCode).json(thumbnailError);
    }

    // upload to cloudinary using await
    let cloudinaryVideoResponse;
    let cloudinaryThumbnailResponse;

    if (videoLocalPath) {
      cloudinaryVideoResponse = await uploadOnCloudinary(videoLocalPath);
      // give error if cannot upload
      if (!cloudinaryVideoResponse) {
        const videoError = new ApiError(500, "Video Upload Error", [
          { msg: "video cannot be uploaded" },
        ]);
        return res.status(videoError.statusCode).json(videoError);
      }
    }
    if (thumbnailLocalPath) {
      cloudinaryThumbnailResponse = await uploadOnCloudinary(
        thumbnailLocalPath
      );
      // give error if cannot upload
      if (!cloudinaryThumbnailResponse) {
        const thumbnailError = new ApiError(500, "Thumbnail Upload Error", [
          { msg: "thumbnail cannot be uploaded" },
        ]);
        return res.status(thumbnailError.statusCode).json(thumbnailError);
      }
    }

    // create and save the video document in database (keep in mind the owner linking)
    const newVideoDoc = new Video({
      videoFile: cloudinaryVideoResponse.url,
      thumbnail: cloudinaryThumbnailResponse.url,
      title,
      description,
      owner: req.user?._id,
      duration: cloudinaryVideoResponse.duration,
    });

    // save to database
    const saveVideoDoc = await newVideoDoc.save();
    if (!saveVideoDoc) {
      const saveVideoDocError = new ApiError(500, "Video create Error", [
        { msg: "video cannot be created" },
      ]);
      return res.status(saveVideoDocError.statusCode).json(saveVideoDocError);
    }
    if (saveVideoDoc) {
      const successResponse = new ApiResponse(
        201,
        "Video Created Successfully",
        saveVideoDoc._doc
      );
      return res.status(successResponse.statusCode).json(successResponse);
    }
  } catch (error) {
    console.log(error);
    const serverError = new ApiError(500, "Internal Server Error");
    return res.status(serverError.statusCode).json(serverError);
  }
});

```