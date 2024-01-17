## Two ways to connect database in mern

1. write all the code in index.js file.

- example code

  ```javascript
  import { DB_NAME } from "./constants.js";

  import mongoose from "mongoose";
  import express from "express";

  (async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

      /*
       use express event listeners to check for errors,
       DB connection might be successful, but express
       might still have some errors.
      */
      app.on("Error", (error) => {
        console.log(`Error ${error}`);
        throw error;
      });

      // as db is connected, listen on server.
      app.listen(process.env.MONGODB_URI, () => {
        console.log(`Server is running on PORT: ${process.env.MONGODB_URI}`);
      });
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  })();
  ```

2. write database connection code in different folder (db) and maintain modularity in code. [ preffered approach ].

- example code

  ```javascript
  import { DB_NAME } from "../constants.js";

  import mongoose from "mongoose";

  const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB_URI}/${DB_NAME}`
      );
      console.log(
        `DataBase Connection Succesfull.\nDB Host: ${connectionInstance.connection.host}`
      );
    } catch (error) {
      console.log(`Error: ${error}`);
      process.exit(1);
    }
  };
  ```

## process.exit() explanation:

process.exit(0):

- Code 0 typically means successful termination.
- When a program exits with code 0, it indicates that everything ran without errors.

process.exit(1):

- Code 1 generally signifies that there was an issue or an error during the execution of the program.
- It's commonly used to indicate a generic error condition.

Other Exit Codes:

- Beyond 0 and 1, you can use other numeric codes to convey specific information about the program's exit status.
- For example, you might use different codes to represent different types of errors or states.

## some npm packages understanding

- `dotenv` package is installed, because `.env` file is used.
  - `dotenv` still uses `require` syntax even after choosing `modulejs` in `package.json`.
  - but to use, modern `import` syntax with `dotenv` we have to enable `experimental` features in `package.json` file.
    - go to `package.json` file.
    - under `scripts` section add these words and flags:
      ```javascript
      "scripts": {
        "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
      }
      ```

## In between tips from hitesh sir

- always use `try/catch` block for database connection, as some unexpected errors might occur.
- database connection is asynchronous task, always use `async/await`.
- use iife (immediately invoked function expression) for database connection.
  - professional devs use semicolon ";" before writing iife.
- remove slash "/" from mongoDB connection url string from `.env` file.
  - add database name you set up in constants.js file at the end of this string.
