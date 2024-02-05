# 18 Update user details endpoints and controllers

**Note: 
Code is not debugged & tested, it will be performed in upcoming commit.
So, understand that this code will have some bugs.**

### 5 New Controllers for updating the user.

## 1. Change Password Controller

### `changeCurrentPassword` Controller Documentation

---

### Purpose:

This controller is responsible for updating the password of the current user. It ensures that the provided old password matches the existing one, and if so, updates it to the new password.

---

### How It Works:

1. **Validation Check:**
    - Checks for validation errors using the `express-validator` library.
    - If any validation errors are found, it responds with details about the errors.
    
    ```jsx
    const errors = validationResult(req);
    if (errors) {
      const validationErrors = new ApiError(
        400,
        "Validation errors",
        errors.array()
      );
      return res.status(validationErrors.statusCode).json(validationErrors);
    }
    
    ```
    
2. **Password Matching Check:**
    - Compares the new password with the confirmed password.
    - If they do not match, it responds with an error.
    
    ```jsx
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    if (newPassword !== confirmPassword) {
      const passwordNotMatchError = new ApiError(
        400,
        "New password & confirm password do not match"
      );
      return res
        .status(passwordNotMatchError.statusCode)
        .json(passwordNotMatchError);
    }
    
    ```
    
3. **Verify Old Password:**
    - Retrieves the current user from the database based on the user's ID.
    - Checks if the provided old password matches the one stored for the user.
    - If the old password is incorrect, it responds with an error.
    
    ```jsx
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
    
    if (!isPasswordCorrect) {
      const wrongPasswordError = new ApiError(400, "Wrong old password");
      return res.status(wrongPasswordError).json(wrongPasswordError);
    }
    
    ```
    
4. **Update Password:**
    - If all checks pass, updates the user's password to the new one.
    - Saves the updated user without performing validations to avoid conflicts.
    
    ```jsx
    user.password = newPassword;
    const updatedUser = await user.save({ validateBeforeSave: false });
    
    ```
    
5. **Prepare Success Response:**
    - Constructs a success response with a message and the updated user data.
    
    ```jsx
    const successResponse = new ApiResponse(
      200,
      "User new password updated successfully",
      updatedUser
    );
    return res.status(successResponse.statusCode).json(successResponse);
    
    ```
    
6. **Error Handling:**
    - In case of any unexpected errors, it logs the error and responds with a generic server error.
    
    ```jsx
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
    
    ```
    

---

### Request:

- **Method:** POST
- **Route:** `/update-user-password`

### Request Body:

```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}

```

---

### Response:

- **Success:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "User new password updated successfully",
          "success": true,
          "data": {
            // Updated user data
          }
        }
        
        ```
        
- **Validation Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Validation errors",
          "success": false,
          "errors": [
            // Validation error details
          ]
        }
        
        ```
        
- **Password Mismatch Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "New password & confirm password do not match",
          "success": false
        }
        
        ```
        
- **Wrong Old Password Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Wrong old password",
          "success": false
        }
        
        ```
        
- **Server Error:**
    - Status Code: 500
    - Body:
        
        ```json
        {
          "statusCode": 500,
          "message": "Internal Server Error",
          "success": false
        }
        
        ```
        

---

## 2. Change FullName Controller

### `changeFullName` Controller Documentation

---

### Purpose:

This controller is responsible for updating the full name of the current user.

---

### How It Works:

1. **Validation Check:**
    - Checks for validation errors using the `express-validator` library.
    - If any validation errors are found, it responds with details about the errors.
    
    ```jsx
    const errors = validationResult(req);
    if (errors) {
      const validationErrors = new ApiError(
        400,
        "Validation errors",
        errors.array()
      );
      return res.status(validationErrors.statusCode).json(validationErrors);
    }
    
    ```
    
2. **Update Full Name:**
    - Retrieves the current user's ID from the request.
    - Updates the user's full name in the database.
    - Returns the updated user, excluding sensitive information like password and refresh token.
    
    ```jsx
    const { fullName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { fullName } },
      { new: true }
    ).select("-password -refreshToken");
    
    ```
    
3. **User Existence Check:**
    - Checks if the user was successfully updated.
    - If not, responds with an error indicating that no user was found.
    
    ```jsx
    if (!updatedUser) {
      const noUserFoundError = new ApiError(400, "No user found");
      return res.status(noUserFoundError.statusCode).json(noUserFoundError);
    }
    
    ```
    
4. **Prepare Success Response:**
    - Constructs a success response with a message and the updated user data.
    
    ```jsx
    const successResponse = new ApiResponse(
      200,
      "Full name updated successfully",
      updatedUser._doc
    );
    return res.status(successResponse.statusCode).json(successResponse);
    
    ```
    
5. **Error Handling:**
    - In case of any unexpected errors, it logs the error and responds with a generic server error.
    
    ```jsx
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
    
    ```
    

---

### Request:

- **Method:** POST
- **Route:** `/update-user-fullname`

### Request Body:

```json
{
  "fullName": "New Full Name"
}

```

---

### Response:

- **Success:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "Full name updated successfully",
          "success": true,
          "data": {
            // Updated user data
          }
        }
        
        ```
        
- **Validation Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Validation errors",
          "success": false,
          "errors": [
            // Validation error details
          ]
        }
        
        ```
        
- **No User Found Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "No user found",
          "success": false
        }
        
        ```
        
- **Server Error:**
    - Status Code: 500
    - Body:
        
        ```json
        {
          "statusCode": 500,
          "message": "Internal Server Error",
          "success": false
        }
        
        ```
        

---

## 3. Change Avatar Picture Controller

### `changeAvatar` Controller Documentation

---

### Purpose:

This controller is responsible for updating the avatar of the current user. It allows users to upload a new avatar image, and if successful, it updates the user's avatar URL.

---

### How It Works:

1. **Avatar Image Check:**
    - Checks if an avatar image file is provided in the request.
    - If not, responds with an error indicating that an avatar image is required.
    
    ```jsx
    let avatarLocalPath = "";
    
    if (!req.file || !req.file.avatar) {
      const fileError = new ApiError(400, "Avatar is Required", [
        { msg: "avatar image is not provided" },
      ]);
      return res.status(fileError.statusCode).json(fileError);
    }
    
    ```
    
2. **Local Avatar Path:**
    - Retrieves the local path of the uploaded avatar image.
    
    ```jsx
    if (req.file) {
      avatarLocalPath = req.file.avatar?.path;
    }
    
    ```
    
3. **Cloudinary Upload:**
    - If a local path is available, uploads the avatar image to Cloudinary.
    - If successful, obtains the Cloudinary response, including the image URL.
    
    ```jsx
    let avatarResponse;
    if (!avatarLocalPath) {
      avatarResponse = await uploadOnCloudinary(avatarLocalPath);
    
      if (!avatarResponse) {
        const uploadError = new ApiError(400, "Avatar cannot be uploaded");
        return res.status(uploadError.statusCode).json(uploadError);
      }
    }
    
    ```
    
4. **Update Avatar URL:**
    - Updates the user's avatar URL in the database based on the Cloudinary response.
    - Returns the updated user, excluding sensitive information like the password and refresh token.
    
    ```jsx
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: avatarResponse?.url } },
      { new: true }
    );
    
    ```
    
5. **Prepare Success Response:**
    - Makes a success response with a message and the updated user data.
    
    ```jsx
    const successResponse = new ApiResponse(
      200,
      "Avatar updated successfully",
      updatedUser._doc
    );
    return res.status(successResponse.statusCode).json(successResponse);
    
    ```
    
6. **Error Handling:**
    - In case of any unexpected errors, it logs the error and responds with a generic server error.
    
    ```jsx
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
    
    ```
    

---

### Request:

- **Method:** POST
- **Route:** `/update-user-avatar`

### Request Body:

- Form data with `avatar` field containing the new avatar image file.

---

### Response:

- **Success:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "Avatar updated successfully",
          "success": true,
          "data": {
            // Updated user data
          }
        }
        
        ```
        
- **Avatar Required Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Avatar is Required",
          "success": false,
          "errors": [
            {
              "msg": "avatar image is not provided"
            }
          ]
        }
        
        ```
        
- **Cloudinary Upload Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Avatar cannot be uploaded",
          "success": false
        }
        
        ```
        
- **Server Error:**
    - Status Code: 500
    - Body:
        
        ```json
        {
          "statusCode": 500,
          "message": "Internal Server Error",
          "success": false
        }
        
        ```
        

---

## 4. Change Cover Image Controller

### `changeCoverImage` Controller Documentation

---

### Purpose:

This controller is responsible for updating the cover image of the current user. It allows users to upload a new cover image, and if successful, it updates the user's cover image URL.

---

### How It Works:

1. **Cover Image Check:**
    - Checks if a cover image file is provided in the request.
    - If not, responds with an error indicating that a cover image is required.
    
    ```jsx
    let coverImageLocalPath = "";
    
    if (!req.file || !req.file.coverImage) {
      const fileError = new ApiError(400, "Cover image is Required", [
        { msg: "cover image is not provided" },
      ]);
      return res.status(fileError.statusCode).json(fileError);
    }
    
    ```
    
2. **Local Cover Image Path:**
    - Retrieves the local path of the uploaded cover image.
    
    ```jsx
    if (req.file) {
      coverImageLocalPath = req.file.coverImage?.path;
    }
    
    ```
    
3. **Cloudinary Upload:**
    - If a local path is available, uploads the cover image to Cloudinary.
    - If successful, obtains the Cloudinary response, including the image URL.
    
    ```jsx
    let coverImageResponse;
    if (!coverImageLocalPath) {
      coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);
    
      if (!coverImageResponse) {
        const uploadError = new ApiError(400, "Cover image cannot be uploaded");
        return res.status(uploadError.statusCode).json(uploadError);
      }
    }
    
    ```
    
4. **Update Cover Image URL:**
    - Updates the user's cover image URL in the database based on the Cloudinary response.
    - Returns the updated user, excluding sensitive information like the password and refresh token.
    
    ```jsx
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: coverImageResponse?.url } },
      { new: true }
    );
    
    ```
    
5. **Prepare Success Response:**
    - Constructs a success response with a message and the updated user data.
    
    ```jsx
    const successResponse = new ApiResponse(
      200,
      "Cover image updated successfully",
      updatedUser._doc
    );
    return res.status(successResponse.statusCode).json(successResponse);
    
    ```
    
6. **Error Handling:**
    - In case of any unexpected errors, it logs the error and responds with a generic server error.
    
    ```jsx
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
    
    ```
    

---

### Request:

- **Method:** POST
- **Route:** `/update-user-coverImage`

### Request Body:

- Form data with `coverImage` field containing the new cover image file.

---

### Response:

- **Success:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "Cover image updated successfully",
          "success": true,
          "data": {
            // Updated user data
          }
        }
        
        ```
        
- **Cover Image Required Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Cover image is Required",
          "success": false,
          "errors": [
            {
              "msg": "cover image is not provided"
            }
          ]
        }
        
        ```
        
- **Cloudinary Upload Error:**
    - Status Code: 400
    - Body:
        
        ```json
        {
          "statusCode": 400,
          "message": "Cover image cannot be uploaded",
          "success": false
        }
        
        ```
        
- **Server Error:**
    - Status Code: 500
    - Body:
        
        ```json
        {
          "statusCode": 500,
          "message": "Internal Server Error",
          "success": false
        }
        
        ```
        

---

## 5. Get The Current User Controller

### `getCurrentUser` Controller Documentation

---

### Purpose:

This controller is responsible for fetching the details of the current user.

---

### How It Works:

1. **Fetch Current User:**
    - Attempts to retrieve the details of the current user from the request.
    
    ```jsx
    try {
      const successResponse = new ApiResponse(
        200,
        "User fetched successfully",
        req.user || "Req.user not found, No data found for the current user."
      );
      return res.status(successResponse.statusCode).json(successResponse);
    }
    
    ```
    
2. **Prepare Success Response:**
    - Constructs a success response with a message and either the current user data or a message indicating that no data was found for the current user.
    
    ```jsx
    const successResponse = new ApiResponse(
      200,
      "User fetched successfully",
      req.user || "Req.user not found, No data found for the current user."
    );
    return res.status(successResponse.statusCode).json(successResponse);
    
    ```
    
3. **Error Handling:**
    - In case of any unexpected errors, it logs the error and responds with a generic server error.
    
    ```jsx
    } catch (error) {
      console.log(error);
      const serverError = new ApiError(500, "Internal Server Error");
      return res.status(serverError.statusCode).json(serverError);
    }
    
    ```
    

---

### Request:

- **Method:** GET
- **Route:** `/get-current-user`

---

### Response:

- **Success:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "User fetched successfully",
          "success": true,
          "data": {
            // Current user data
          }
        }
        
        ```
        
- **No User Found Message:**
    - Status Code: 200
    - Body:
        
        ```json
        {
          "statusCode": 200,
          "message": "User fetched successfully",
          "success": true,
          "data": "Req.user not found, No data found for the current user."
        }
        
        ```
        
- **Server Error:**
    - Status Code: 500
    - Body:
        
        ```json
        {
          "statusCode": 500,
          "message": "Internal Server Error",
          "success": false
        }
        
        ```
        

---