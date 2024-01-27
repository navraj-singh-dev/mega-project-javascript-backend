import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { validationResult } from "express-validator";

export const registerUser = asyncHandler(async (req, res) => {
  // validate user's input
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    const validationError = new ApiError(
      400,
      "Validation Error",
      errors.array()
    );
    return res.status(validationError.statusCode).json(validationError);
  } else {
    try {
      // destructure the user info
      const { username, email, fullName, password } = req.body;

      // check if user already exist
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        const userExistsError = new ApiError(400, "User Already Exists", [
          { msg: "username or email already exist." },
        ]);
        return res.status(userExistsError.statusCode).json(userExistsError);
      }

      // multer to upload files temporarily on server
      let avatarLocalPath;
      let coverImageLocalPath = "";
      if (req.files) {
        if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
          avatarLocalPath = req.files.avatar[0].path;
        }
        if (
          Array.isArray(req.files.coverImage) &&
          req.files.coverImage.length > 0
        ) {
          coverImageLocalPath = req.files.coverImage[0].path;
        }
      }
      if (!req.files || !req.files.avatar) {
        const filesError = new ApiError(400, "Avatar is Required", [
          { msg: "avatar image is not provided" },
        ]);
        return res.status(filesError.statusCode).json(filesError);
      }

      // upload on cloudianry
      let cloudinaryAvatarResponse;
      let cloudinaryCoverImageResponse;

      if (avatarLocalPath) {
        cloudinaryAvatarResponse = await uploadOnCloudinary(avatarLocalPath);

        if (!cloudinaryAvatarResponse) {
          const avatarError = new ApiError(500, "Avatar Upload Error", [
            { msg: "avatar cannot be uploaded" },
          ]);
          return res.status(avatarError.statusCode).json(avatarError);
        }
      }
      if (coverImageLocalPath) {
        cloudinaryCoverImageResponse = await uploadOnCloudinary(
          coverImageLocalPath
        );
      }

      // create & save new user to DB
      const newUserObj = new User({
        username,
        fullName,
        email,
        password,
        avatar: cloudinaryAvatarResponse.url,
        coverImage: cloudinaryCoverImageResponse?.url || "",
      });

      const newUser = await newUserObj.save();
      if (!newUser) {
        const newUserError = new ApiError(500, "User Creation Error", [
          { msg: "user cannot be created" },
        ]);
        return res.status(newUserError.statusCode).json(newUserError);
      }
      // Including this if-block-check decreases time taken to register a user in database
      // If this if-block-check is removed "password" variable's scope error conflicts with req.body
      if (newUser) {
        const { _id, password, refreshToken, ...sanitizedUser } = newUser._doc;
        const successResponse = new ApiResponse(
          201,
          "User Registered Successfully",
          sanitizedUser
        );
        return res.status(successResponse.statusCode).json(successResponse);
      }
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
  }
});
