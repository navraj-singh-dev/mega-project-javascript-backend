## Starting the express server

- only start and listen on the server, if database connection was successfull.
- for this use `promises (then/catch)` with database connector method you created in `db` folder.
- before listening on express server, also use express's event listener for "error" to stop server immediately and handle any error.
- Example Code:

  ```javascript
  connectDB()
    .then(() => {
      app.on("error", (error) => {
        console.log(`\nExpress Server Error: \n${error}`);
        throw error;
      });
      app.listen(process.env.PORT || 8000, () => {
        console.log(
          `\nExpress Server Running On PORT: ${process.env.PORT || 8000}`
        );
      });
    })
    .catch((error) => {
      console.log(`\nMongoDB Connection Failed: \n${error}`);
    });
  ```

## Packages Installed At This Instance

1. cors
   understanding:

   - it is a npm package to handle cors origin policy issues.
   - it is a middleware.
   - just use this line of code: `app.use(cors())`. Now cors origin issues are all set.
   - you can also give a object with some options in it to the `cors()` to further configure it.
   - example code:

     ```javascript
     app.use(
       cors({
         origin: process.env.CORS_ORIGIN,
         credentials: true,
       })
     );
     ```

2. cookie-parser
   understanding:

   - it is a npm package.
   - it is a middleware.
   - it allows the server application to handle cookies in user's browser.
   - basically, our server can do cookie related CRUD operations on user's browser.
   - example code:

   ```javascript
   app.use(cookieParser());
   ```

## Utils Folder's Methods and Wrapper functions

- in utils folder developers contain only helper functions that serves some help and functionality.
- most of the time they are wrapper functions (a higher order function).
- for example:

  - lets say you have many `async functions` and you want to add some error handling to each of them.
  - instead of writing and adding error handling code again and again to each of them,
    wrap that `async function` inside of a utility function.
  - utility function you created will take a `async function` and execute it,
    but it will also handle the error handling part, if that given `async function` fails during execution.
  - example code:
    There are two ways to make util functions:

    1. try/ catch

    ```javascript
    const asyncHandler = (fn) => {
      async (req, res, next) => {
        try {
          await fn(req, res, next);
        } catch (error) {
          res.status(error.code || 500).json({
            success: false,
            message: error.message,
          });
        }
      };
    };
    ```

    2. promises

    ```javascript
    const asyncHandler = (fn) => {
      (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
          next(error);
        });
      };
    };
    ```

- see, util function is just taking a another function and executing it,
  but the main premise is that it performs error handling and gives some insights about the
  error that occured and provide the status code, message and a success: true/false flag in a response.
- but utils functions are not only for `error handling and error insights` but also about,
  logging, authentication checks, data validation, and more.

2. creating custom, well-defined errors and error structure for standardization

- using NodeJS build in `error class` developers can easily create their own errors.
- to make a custom standardized error for the project globally, nodejs `error class` can be extended
- example code:

  ```javascript
  // This is a class called ApiError, extending from the built-in Error class in JavaScript.
  class ApiError extends Error {
    // The constructor is a special method that gets called when you create a new instance of the class.
    constructor(
      // These are parameters that you can pass when creating a new ApiError instance.
      statusCode, // HTTP status code for the error.
      message = "Something Went Wrong", // A message describing the error. Default is "Something Went Wrong".
      errors = [], // An array that can hold additional details about the error.
      stack = "" // A stack trace providing information about where the error occurred.
    ) {
      // The super() function calls the constructor of the parent class (Error in this case).
      // In JavaScript, when you extend a class, the child class's constructor (ApiError in this case) must call super() before using this.
      super(message);

      // These lines assign values to properties of the ApiError instance.
      this.statusCode = statusCode; // HTTP status code of the error.
      this.message = message; // A descriptive message for the error.
      this.errors = errors; // Additional details about the error.
      this.success = false; // A flag indicating that the operation was not successful.
      this.data = null; // An optional property to hold additional data related to the error.

      // If a stack trace is provided, set it; otherwise, capture the stack trace.
      if (stack) {
        this.stack = stack; // If a stack is provided, use it.
      } else {
        Error.captureStackTrace(this, this.constructor);
        // If no stack is provided, capture the stack trace using the Error.captureStackTrace() method.
        // This is helpful for debugging and figuring out where the error occurred in your code.
      }
    }
  }

  // Export the ApiError class so that you can use it in other parts of your code.
  export { ApiError };
  ```

- now every error we will make using this class will have same & standardized structure in the project globally,
  making debugging easy.

3. creating custom, well-defined errors responses and error response structure for standardization

- nodejs dont have any response class, so to make custom response we have to make the class by ourselves.
- this way every response that will be created using this class will have same & standardized structure in the project globally.
- example code:
  ```javascript
  class ApiResponse {
    constructor(statusCode, message = "Success", data) {
      this.statusCode = statusCode;
      this.message = message;
      this.success = statusCode < 400;
      this.data = data;
    }
  }
  export { ApiResponse };
  ```

## About MiddleWares

- it is a function that runs before server.
- it executes the code inside of it and then calls the next middleware or code using next().
- middleware can:
  - end the req/res cycle.
  - modify the req/res objects.
  - it can execute any code.
  - run before server even starts.
  - call the next middleware or code using next().
- for example:
  - if some user come on a endpoint `/delete_account`, but to get the access to this end-point you need to be logged in.
  - so a middleware can be created to check if the user is logged in, before server is run.
  - if user is not logged in then middleware will stop the req/res cycle, if user is logged in then allow them to the communicate with server using next().

## In Between Tips & Lessons By Hitesh Sir

- to our backend data can come in different forms:

  - url (req.params, url-encoded middleware)

    - url never have spaces instead it convert spaces to `+` `%20`.
    - so express server can't understand this url and its structure.
    - use middleware `express.urlencoded()` to make express server understand url and its structure.
    - example code:

      ```javascript
      app.use(express.urlencoded({ extended: true, limit: "20kb" }));
      // here extended true means, object inside objects/ nested object are supported now.
      ```

  - form (req.body)
  - json (use a middleware called express.json())

    - you can also add a option to accept only a certain limit of json to prevent server load and crashing.
    - example code:

      ```javascript
      app.use(express.json({ limit: "20kb" }));
      ```

  - cookies (use cookie-parser package)
  - files (multer package)
  - static files (express.static("public"))

    - this middleware is just used to store static files on the server itself.
    - static files are publically available for everyone to access.
    - for example: pdf, images, logos, favicon.
