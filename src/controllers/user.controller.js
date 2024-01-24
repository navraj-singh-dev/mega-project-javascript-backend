import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, username, email, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const checkExistingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkExistingUser) {
    throw new ApiError(409, "User already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const responseFromCloudinaryAvatar = await uploadOnCloudinary(
    avatarLocalPath
  );
  const responseFromCloudinaryCoverImage = await uploadOnCloudinary(
    coverImageLocalPath
  );

  if (!responseFromCloudinaryAvatar) {
    throw new ApiError(500, "Error during avatar upload");
  }

  const newUserEntry = await User.create({
    fullName,
    username: username.toLowerCase,
    email,
    password,
    avatar: responseFromCloudinaryAvatar.url,
    coverImage: responseFromCloudinaryCoverImage?.url || "",
  });

  const checkNewUserEntry = await User.findById(newUserEntry._id).select(
    "-password -refreshToken"
  );

  if (!checkNewUserEntry) {
    throw new ApiError(500, "User cannot be created");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User created successfully", checkNewUserEntry));
});
