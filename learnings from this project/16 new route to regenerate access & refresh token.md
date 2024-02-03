# 16 new route to regenerate access & refresh token


## Discussion For Both Access & Refresh Token

These both tokens are mainly used for keeping the user logged-in and preventing
the task of making user give their password and email/username again & again.
So the concept of making two tokens was introduced by google in a published
research paper, where they talked about how access token will keep the user logged
in and refresh token will be used to re-generate the access token.

Both tokens have validity. Access token is short lived and Refresh token is long lived. 

## More About Access Token

 

- Stored in cookies and not stored on the server.
- Short lived, expires in usually 15 min - 1 Day.
- Keeps the user logged in till it expires.
- It validated the fact that user is actually logged-in.

## More About Refresh Token

- Lets say, for this project, when a user is logged in but their access token is now expired. Now when ever some user from frontend will try to access something on application when their access token is expired they would not be able to access the resource and in return the server will give frontend a 401/xxx error, so before letting the user know that the login session is expired as access token is expired, front end developer will write a code that will immediately make a request to a endpoint where in the request the front end developer will send user’s refreshToken to the backend and backend will generate a new access token for the user and user will be again automatically logged-in.
- This way we are preventing the boring process of making the user give their login details again and again whenever the access token is expired.
- Refresh token is also made as a field inside the user’s schema in mongoDB. Every user document will have a “refreshToken” field where their refresh token is stored.
- The frontend developer will send a refresh token in request, backend will match that refresh token with the user’s refresh token in mongoDB and if it matches then the new tokens (both access & refresh) will be generated and given to frontend to login user automatically again.

## Explaining controller(regenerateToken) created in this commit

**Code is neither debugged or tested, it may have some bugs and issues that will be fixed in upcoming commit.**

### `regenerateTokens` Controller

---

### Overview:

The `regenerateTokens` controller is designed to handle requests for regenerating access and refresh tokens. This is particularly useful when an access token has expired, and the frontend needs to refresh it to maintain an active session.

---

### How It Works:

1. **Retrieve the Refresh Token:**
    - The controller looks for the refresh token in different places: cookies, authentication headers, or the request body.
    - If no refresh token is provided, it responds with an error indicating that no token was provided.
    
    ```jsx
    // Take the refresh token from cookies, headers, or request body
    const incomingRefreshToken =
      req.cookies?.RefreshToken ||
      req.headers.authentication?.replace("Bearer ", "") ||
      req.body.RefreshToken;
    
    // Check if token is not empty
    if (!incomingRefreshToken) {
      const noTokenError = new ApiError(401, "No token provided");
      return res.status(noTokenError.statusCode).json(noTokenError);
    }
    
    ```
    
2. **Verify and Extract Payload:**
    - It uses the `jsonwebtoken` library to verify the incoming refresh token against the secret.
    - Extracts the user payload from the verified token.
    
    ```jsx
    // Verify and extract payload from refresh token
    const userPayloadObj = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    
    ```
    
3. **Check User Existence:**
    - Retrieves the user from the database based on the payload.
    - If the user doesn't exist, it returns an error stating that no user matches the provided token.
    
    ```jsx
    // Find the user based on the extracted payload
    const sanitizedUser = await User.findById(userPayloadObj?._id).select(
      "-password"
    );
    
    // If user not found, return an error
    if (!sanitizedUser) {
      const tokenMatchError = new ApiError(401, "No user match this token");
      res.status(tokenMatchError.statusCode).json(tokenMatchError);
    }
    
    ```
    
4. **Token Matching Check:**
    - Ensures that the refresh token matches the one stored in the user data.
    - If there's a mismatch, it indicates that the token might be expired or invalid.
    
    ```jsx
    // Check if the refresh token matches the one stored in the user data
    if (!(sanitizedUser.refreshToken === incomingRefreshToken)) {
      const tokenMatchError = new ApiError(
        401,
        "Token do not match, token might be expired or invalid"
      );
      res.status(tokenMatchError.statusCode).json(tokenMatchError);
    }
    
    ```
    
5. **Generate New Tokens:**
    - If all checks pass, it generates new access and refresh tokens using user-specific methods.
    
    ```jsx
    // Generate new access and refresh tokens
    const accessToken = await sanitizedUser.generateAccessToken();
    const refreshToken = await sanitizedUser.generateRefreshToken();
    
    ```
    
6. **Update User's Refresh Token:**
    - Updates the user's refresh token in the database.
    
    ```jsx
    // Update user's refresh token in the database
    const updatedUser = await findOneAndUpdate(
      { _id: userPayloadObj?._id },
      { $set: { refreshToken } },
      { new: true }
    );
    
    ```
    
7. **Prepare Response Object:**
    - Makes a response object with the newly generated access and refresh tokens, along with the sanitized user data.
    
    ```jsx
    // Create an object with newly generated tokens and sanitized user data for response
    const sanitizedUpdatedUser = {
      accessToken,
      refreshToken,
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    };
    
    ```
    
8. **Set Cookies and Respond:**
    - Sets secure HTTP-only cookies for the new access and refresh tokens.
    - Sends a success response with the updated tokens and user information.
    
    ```jsx
    // Set secure HTTP-only cookies for the new tokens
    const cookieSettings = {
      httpOnly: true,
      secure: true,
    };
    
    // Respond with success and set cookies
    res
      .status(successResponse.statusCode)
      .cookie("AccessToken", accessToken, cookieSettings)
      .cookie("RefreshToken", refreshToken, cookieSettings)
      .json(successResponse);
    
    ```
    

---

### Route Information:

- **Route Endpoint:** `/regenerate-tokens`
- **HTTP Method:** POST
- `router.route("regenerate-tokens").post(regenerateTokens);`

---