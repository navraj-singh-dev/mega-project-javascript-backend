# 15 Login & Logout Controller, Auth Middleware, Routes, Access & Refresh Tokens, Cookies

## Learnings Here

- 2 routes inside (user.route.js) → (/login, /logout)
- A middleware (auth.middleware.js)
- 2 controllers for /logout and /login in user.controller.js
- Note: Till now, no testing/ debugging is performed.
All the code is completely un-tested.

## Access Tokens Introduction

- It is mostly a JWT token.
- It is short lived (15min, 30min, even 1Day, etc.)
- It is used to keep the user logged in.
- As long as Access Token is not expired, user can perform 
  any task the logged in user can perform on the server, 
  when the access token is expired the access is revoked
  & new access token needs to be created again.

## Refresh Tokens Introduction

- It is also mostly a JWT token.
- It is long lived (1Day, 2Day, ,even 30Days, etc.)
- It is stored in user's document of mongoDB.
- When a access token is expired, the user needs to
  input their email or username & password to login
  again on the application. To solve this problem of
  making user give their credentials again and again
  to login refresh tokens are used. In this scenario
  the refresh token comes into play.
- How refresh tokens are used in here?
  Well, the frontend will make a request on a certain
  endpoint where they will provide refresh token either
  in cookies or headers and that frontend refresh token
  will be matched with refresh token of user in the 
  database. If it matches then new access token will be
  provided. 

## Using The Methods That Were Earlier Created…
## `userSchema.methods.generateAccessToken`
## &
## `userSchema.methods.generateRefreshToken`

These JWT Token’s are used and helpful for login purpose here.
To keep the user logged in a `access token` will be created for them.
When the access token is expired the refresh token will be used to create a
new access token for the user without them to re-fill their username and password.
For this JWT Token creation i had already defined these methods inside the
`user.model.js`.
**Note:** Your custom added methods to the userSchema using `.method` object can only be
accessed via the document of mongoDB that you fetched using mongoose.
Both schema and model can never access these custom methods created
using the `.methods` object.

## Explaining Routes

### `route /login`

```jsx
router
  .route("/login")
  .post(
    [
      body("identifier")
        .isEmpty()
        .withMessage("Username is required")
        .trim()
        .toLowerCase(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    loginUser
  );
```

- Here user’s will be logged in.
- A middleware will run before the controller runs.
- Middleware just performs validation on the user input
and some operations on it.
- “identifier” is just a industry standard variable name
used when login can happen on various inputs.
for example, a user can give us `username` or `email`
not both of them, but either of them. So “identifier”
is just a variable name that is used here. Which
refers that input can be either `username` or `email` .
- Same with password, validation.

### `route /logout`

```jsx
router.route("/logout").post(verifyJWT, logoutUser);
```

- Yeah, that’s it.
- Custom made middleware name `verifyJWT` will run,
before the controller.
Middleware is made in a separate file in `auth.middleware.js`.
why? because this middleware is used to know if the user is
logged in by checking the user’s JWT tokens & this middleware
can be used somewhere else too, So creating it in a separate
module is a good move.
- This middleware is explained below.

Nice all the routes for this instance are discussed.

## Explaining Middleware

### `auth.middleware.js`

```jsx
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
```

- This middleware verifies the JWT Token (access token).
Why? it is used to tell whether the user is currently logged-in
or not.
- This middleware just tells whether the user is logged-in.
so? well by knowing if the user is logged in and user is valid
we can let them do some actions on the website that only
logged-in user can perform.
- Like? liking a video, logging-out, deleting a video, changing
their avatar (profile photo), etc.
So, this middleware will tell us whether the user can perform
these tasks by letting us know if the user is logged in.
- **Flow of code:**
    1. Client side will give us token either in cookies or headers.
    2. Validate token for emptiness. If no token is given then
    3. Use JWT library/package to check if token is actually
    generated by our secret in .env file or not.
    jwt.verify() will return a payload, that was used to create
    the token.
    4. Now, we have the payload (data).
    Use this payload to fetch the user from database
    using their _id from payload.
    Sanitize the fetched user (it means removing the
    fields from fetched document that contains sensitive
    information).
    5. If user is not found then return response from ApiError Class.
    6. Put the sanitized fetched user object inside of `req` object,
    this `req` object will be sent to controller for logging out
    the user.
    7. Run next() to give control to the controller.
    8. Use try/catch for this complete code to handle
    any other server errors also.

## Explaining Controllers

### `loginUser`

```jsx
export const loginUser = asyncHandler(async (req, res) => {
  // validate user input
  const errors = await validationResult(req);

  if (!error.isEmpty()) {
    const validationError = new ApiError(
      400,
      "Validation Error",
      errors.array()
    );
    return res.status(validationError.statusCode).json(validationError);
  }

  try {
    // check if user exist maybe through email or username
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      const identifierType = /@/.test(identifier) ? "Email" : "Username";
      const userNotExistError = new ApiError(404, [
        { msg: `${identifierType} doesn't exist` },
        { param: identifier },
      ]);
      return res.status(userNotExistError.statusCode).json(userNotExistError);
    }

    // check password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      const passwordError = new ApiError(401, "Incorrect Password");
      return res.status(passwordError.statusCode).json(passwordError);
    }

    // generate access and refresh token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // update user with refresh token
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { refreshToken } },
      { new: true }
    );

    // remove sensitive info
    const sanitizedUpdatedUser = {
      accessToken,
      refreshToken,
      user: {
        ...updatedUser,
        password: undefined,
      },
    };

    const successResponse = new ApiResponse(
      201,
      "User logged in successfully",
      sanitizedUpdatedUser
    );

    // make cookie secure
    const cookieSettings = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(successResponse.statusCode)
      .cookie("AccessToken", accessToken, cookieSettings)
      .cookie("RefreshToken", refreshToken, cookieSettings)
      .json(successResponse);
  } catch (error) {
    console.log(error);
    const serverError = new ApiError(500, "Internal Server Error");
    return res.status(serverError.statusCode).json(serverError);
  }
});
```

- Yeah, it logs-in a user.
- First of all, don’t code, just write down the steps and all the
scenarios that you think would occur while logging-in a user.
Just write them down as the comments of code first, take time
like 30 mins - <x> mins. Don’t rush to code.
- **Now let’s code, code explanation:**
    1. User gave us their login information on /login endpoint,
    maybe through a html form or god knows from where,
    but we have their `username` or `email` + their `password`
    in the req.body.
    2. Before this controller ran, the middleware specified ran,
    middleware performed the validation on the user’s given data
    and the results can be taken by writing this line of code
    `const errors = await validationResult(req);` 
    Now, all the error that occurred during validation test are here
    in `const errors`.
    3. Then if errors are founds the `if block` if handle it.
    4. Now the try/catch block.
    5. Take the user info from req.body.
    6. Using this info find if the user exists in database or not.
    If not then the `if block` will handle that scenario.
    If user exist then store the reference in a variable
    like `const user`.
    7. Now check password, if its right or wrong.
    To do this use the `.isPasswordCorrect()` which is a
    custom method created in `user.model.js`. Which uses
    bcrypt package under the hood.
    If password is wrong `if block` will handle that.
    8. Now create the `access token` & `refresh token` to ensure
    security.
    9. Now, the generated `access token` is saved in `cookies` 
    and `refresh token` is saved in fetched user’s `refreshToken`
    named field.
    Use mongoose’s findOneAndUpdate() for this. After updating
    this method will return the update document. Store the updated
    user in a reference like `const updatedUser`.
    10. Now sanitize the `const updatedUser` by removing the personal
    info from document like password.
    11. Then return back a response.
    Remember to save cookies (secured ones) in response.
    Access & Refresh Tokens are stored in cookies and also
    sent in back as a response.
    

### `logoutUser`

```jsx
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    // take the id
    const _id = req.user._id;

    // delete refreshToken
    const user = await User.findByIdAndUpdate(
      { _id },
      { $set: { refreshToken: undefined } },
      { new: true }
    ).select("-password");

    const successResponse = new ApiResponse(
      200,
      "User logged out successfully",
      {
        user: {
          user,
        },
      }
    );

    // delete cookies
    const cookieSettings = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(successResponse.statusCode)
      .clearCookie("AccessToken", cookieSettings)
      .clearCookie("RefreshToken", cookieSettings)
      .json(successResponse);
  } catch (error) {
    console.log(error);
    const serverError = new ApiError(500, "Internal server error");
    res.status(serverError.statusCode).json(serverError);
  }
});
```

- Yeah, it logs-out a user.
- First of all, don’t code, just write down the steps and all the
scenarios that you think would occur while logging-out a user.
Just write them down as the comments of code first, take time
like 30 mins - <x> mins. Don’t rush to code.
- **Now let’s code, code explanation:**
    1. Use try/catch.
    2. A middleware `auth.controller.js` ran before this controller.
    This middleware is already explained so keep in mind what
    it do.
    3. Take the _id of the fetched user from req.body and store
    it in a reference.
    A user is considered logged out if the access token & refresh
    token is cleared from cookies and user’s refreshToken field
    is updated from current value to undefined value in the
    database.
    4. Use mongoose’s `findByIdAndUpdate()` to update the user’s
    refreshToken field in database. Save the returned updated user
    by this method in a reference.
    5. Now just create a response using ApiResponse Class and
    delete all the token cookies.
    Send back this response.
    6. Catch will handle any server error.