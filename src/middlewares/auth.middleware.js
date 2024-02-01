import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // take the jwt token from headers or cookies
    const token =
      req.cookies?.AccessToken ||
      req.headers("Authorization")?.replace("Bearer ", "");

    if (!token) {
      const noTokenError = new ApiError(401, "No token provided");
      res.status(noTokenError.statusCode).json(noTokenError);
    }

    // extract payload using jwt
    const userPayloadObj = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // check if user exist in DB with this AccessToken
    const sanitizedUser = await User.findById(userPayloadObj?._id).select(
      "-password -refreshToken"
    );

    if (!sanitizedUser) {
      const tokenMatchError = new ApiError(401, "No user match this token");
      res.status(tokenMatchError.statusCode).json(tokenMatchError);
    }

    req.user = sanitizedUser;
    next();
  } catch (error) {
    console.log(error);
    const serverError = new ApiError(500, "Internal Server Error");
    res.status(serverError.statusCode).json(serverError);
  }
});
