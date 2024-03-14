import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// upload video
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
