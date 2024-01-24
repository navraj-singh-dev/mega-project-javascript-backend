# 14 Register Controller

## Some Information About This Instance

- user.controller.js module’s `Register Controller` is coded. Previously only a skeleton function was created.
- Before coding steps by step approach is created on how to create this controller by handling corner cases, validation and keeping other scenarios in mind.
- This code is not debugged and tested, it will be performed later on.

## Steps (algorithm) & logic used to create this controller

- Get user’s details from frontend, also keeping the mongoose model created in `user.model.js` in mind to get all the information that model demands.
- Perform validations on each required fields to make sure required and important information is provided. Also throw back custom made error from utility `apiError.js` if validation fails.
- Check if user already exist. Throw custom error from utility if user already exist. It can be checked by using `email or username` field.
- Check if avatar image is provided by user as it is required field and it is dependent on multer and cloudinary.
- If avatar is provided then use `cloudinary` utility to upload the image on cloudinary servers. Use async/await here.
    - Then check if upload was successful.
- Done, now create a object with all this information which satisfy the mongoose schema also and then push this object to mongoDB using mongoose. A response will come back from mongoose about this operation of adding a user. Response will have the complete document that got stored in mongoDB.
- From that response, remove the password and refresh token.
- Just for safety, again check if user got created in mongoDB, if not throw error.
- Return response with the help of `apiResponse.js` utility.
- The Code:
    
    ```jsx
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
    ```
    

## Multer’s Usage For This Instance

- Multer is used as a middleware in `user.route.js` .
- Without it our server cannot accept images and other files.
- For registration of user in database, it is crucial.
- The code:
    
    ```jsx
    router.route("/register").post(
      upload.fields([
        {
          name: "avatar",
          maxCount: 1,
        },
        {
          name: "coverImage",
          maxCount: 1,
        },
      ]),
      registerUser
    );
    ```
    
- Here multer will run before the controller and perform its tasks as it is a middleware.
- `upload.fields([ {}, {} ])` from multer is used, it takes one argument which is array and inside array give the object with some configurations.
    - This code line is saying that two images of quantity “1” will be accepted. Image one will have name “avatar” & image two will have name “coverImage”. These names are aligned with mongoose Schema.
    - These name “avatar” and “coverImage” must match with frontend’s form’s field names. Frontend’s form’s field name === multer’s configuration object name field, for multer to work right.
- As now middleware has done it’s job, then controller will have the control and continue it job.

## New Things I Learned During This Controller’s Implementation

- **JavaScript’s some() & trim()**
    
    ```jsx
    if (
        [fullName, username, email, password].some((field) => {
          field?.trim() === "";
        })
      ) {
        throw new ApiError(400, "All fields are required");
      }
    ```
    
    - sum() method is used on Arrays.
    - It takes a callback function, in which most of the time some condition is being checked. In Callback Function array’s each element is passed one by one as argument automatically.
    - some() returns `true` or `false` only.
    - If any one element of array passed the condition then some() immediately stops and returns true, if none element passed then some() returns false.
    - **trim()** is a method that is used for removing whitespaces, tabs etc. from a string. It removes leading and trailing whitespaces or tabs from the string, not from the middle of string.
- **Mongoose’s select() method**
    
    ```jsx
    const checkNewUserEntry = await User.findById(newUserEntry._id)
      .select("-password -refreshToken")
    ```
    
    - select() is used to remove the fields from a mongoDB document.
    - For example, if you created a new entry in database using mongoose model for a new user’s registration and you got the response back from mongoDB through a mongoose model.
    Then you might want to remove some fields from that response like password, token. etc.
    - Use select() for this task.
    In a argument give a string “”. 
    Inside this string write minus “-” + the name of field you want to remove.
    To remove multiple fields just add a space and then again “-field_name”.
    For example see the code snippet above.