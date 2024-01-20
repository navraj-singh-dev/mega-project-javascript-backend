- There are two ways to upload files in backend:

  - Multer.
  - Express file-upload.

- Files are never uploaded to the database and server itself, instead files are uploaded in a third party service:

  - AWS.
  - Cloudinary ( preffered way ).

- Then after uploading files to one of these services, take the link of file and store that link in the database.
- Files are not uploaded to database directly, because databases are slow with files naturally as the store it in buffer and can't make files available quickly. Making user experience bad and slow.

# How will this backend handle files

- professional developers dont directly put the user files to aws or cloudinary. as file upload error can occur during this process of direct upload and file we are uploading will be lost.
- so,
  1. take the file from user using `multer`.
  2. upload the file temporarily on server and local storage.
     so that if any error occurs we can reupload the file again.
  3. upload the file temporarily stored on server to `cloudinary` using their npm package.

# Packages installed or used for this instance

- ## multer (installed)

  - this package helps to take files from user and upload it to the server.
  - it can save files on server, local disk storage.
  - ### flow of multer:
    - create a `const storage` which will store configuration of file to be uploaded.
    - create and export the `const upload` instance of multer which takes a object as argument, where object will take the `storage` configuration.
  - ### code example:

  ```javascript
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
  export const upload = multer({ storage: storage });
  ```

  - ### code explanation:
    - in `const storage` multer is configuration for storing file in disk storage(local storage).
      -> this method takes one parameter that is a object and inside the object there are two required fields (destination & filename).
      both these fields require a function to call.
      -> just write the logic of functions which is quite simple.
      just give path (where to store the file) inside destination.
      then give filename (what will be name of file stored in disk) inside filename.
      -> then give `const storage` to `multer(storage: storage)` to actually store the file.
    - `file` parameter inside both the `function parameter` is given by multer. we can use it with our own logic.
    - `cb` is a callback function. write the logic here.

- ## cloudinary (installed)

  - cloudinary is a data storage service like aws.
  - its package called "cloudinary" will be used to store the files from our server to the cloudinary storage.
  - make a file in util folder and make a util method for this task.
  - code example:

    ```javascript
    const uploadOnCloudinary = async (localFilePath) => {
      try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
        });

        console.log(
          `File Uploaded Sucessfully On Cloudinary.\nURL: ${response.url}`
        );

        return response;
      } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
      }
    };
    export { uploadOnCloudinary };
    ```

  - ### Code explanation:
    - it will take a local storage path -> upload file present on that path to cloudinary and return response.
    - if failed in uploading, then unlink the file from filesystem.
    - error handling and other logic's are defined too.

- ## fs (in-built)
  - it will be used to handle files when they are temporarily on the server.
