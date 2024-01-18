# schemas and models that are implemented for this instance

- Click on this image to open it: <br>[![JYytBNj.md.png](https://iili.io/JYytBNj.md.png)](https://freeimage.host/i/JYytBNj)

# Mongoose's learning for this instance:

- trim option in mongoose schema is used to remove whitespaces from strings,
  removes whitespace characters, including null, or the specified characters from the beginning and end of a string.
- index option in mongoose schema is used to make a field indexable,
  for better & optimized seaching and sorting of that field.
- in mongoose you can give `custom error message` for the field.
  - for example:
    ```javascript
    password: {
        type: String,
        required: [true, "Please Provide Password."],
        unique: false,
    }
    ```
- mongoose provide premade methods for our created schema models like: `updateMany` `insertOne` `insertMany`.
  but to create custom methods for custom functionality we can add custom methods too.
  to add a custom method to a model schema, simply:

  - use `methods` object in mongoose's schema and add your methods there.
  - later on you can simply use that custom method on it.
  - code example:

    ```javascript
    userSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password, this.password); // true or false
    };
    ```

    Here `Schema` has `methods` object. which contains all the mongoose's methods like:
    `updateMany`, `update`, `insertMany` etc.
    Now, simply access this object like shown in code and add your own custom method to this `methods` object.
    Later on, this custom method added can be used.

# About mongoose's plugins and premade middlewares:

- mongoose gives premade plugins and custom plugin support.
- using plugins we can do some functionalites,
  like:

  - doing something before saving data in mongodb.
  - doing something after saving data in mongodb.
  - etc.

- ## Mongoose Premade Hooks

  **1. Pre() Hook:**

  ```javascript
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  ```

  - Pre hook is middleware given by mongoose.
  - it runs the code inside of it just before data is being saved in DB.
  - it takes two argument/parameters: `event to listen for` & `declaritive function only (no arrow function)`.
  - declarative function is used only, because we are gonna use `this` in it.
    and arrow function has no `this` context.
  - attach `pre()` with `schema` you created and give the `event` to listen for
    then give the `async callback function`.
  - for example here in given code above:
    - whenever a `save` is happening in database from the `userSchema` this hook will always run and encrypt the password and then encrypted password will be stored in DB.
    - but as i said, whenever ever any field in this `userSchema` is changed and `save` event is happening, same password will get encrypted again and again.
    - to prevent it `if block` logic is used. this way only when password field is modified via some `update password` or `account creation` only then this middleware will encrypt the password. otherwise not.
    - `isModified()` method is pre-available here to check if some field was
      modified.
    - make sure to use `this` to access fields inside userSchema directly.
    - as `pre()` is a middleware, always use `next()` in declarative callback function.

# About Mongoose's Aggregation Pipeline Usage Here:

- use `schema_name.plugin(mongooseAggregatePaginate)` to create aggregation pipelines for your model.
- a package calles `mongoose-aggregate-paginate-v2` is used.

# Npm packages understanding and usage:

1. mongoose-aggregate-paginate-v2:

   - a npm package, for defining mongoose aggregation pipelines.
   - use `schema_name.plugin(mongooseAggregatePaginate)` to create aggregation pipelines.

2. bcrypt (not bcryptjs):

   - its a npm package to encrypt password.
   - passwords in database are stored in hashed form to increase privacy.
   - example code:

   ```javascript
   userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password, this.password); // true or false
   };

   userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();

     this.password = await bcrypt.hash(this.password, 10);
     next();
   });
   ```

   - here it is used to encrypt the password and check encrypted password's validation.

3. JWT (JSON WEB TOKEN):

   - it is a package also, to generate tokens.
   - it has headers and payload (fancy name for user's data).
   - it takes the data and mask it inside of the generated token (hash).
   - jwt is a bearer token (who has this token has the access).
   - to use jwt always, in the .env file create two token with their respective expiry:

   - add a ACCESS_TOKEN_SECRET (its value can be any random string).
   - add a ACCESS_TOKEN_EXPIRY (its value can be 1d,2d. yes you can write a "integer" with "d" after it.).
   - add a REFRESH_TOKEN_SECRET (its value can be any random string).
   - add a REFRESH_TOKEN_EXPIRY (its value can be 10d, 20d etc).
   - example code:

   ```javascript
   userSchema.methods.generateAccessToken = function () {
     return jwt.sign(
       {
         _id: this._id,
         email: this.email,
         username: this.username,
         fullName: this.fullName,
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
       }
     );
   };

   userSchema.methods.generateRefreshToken = function () {
     return jwt.sign(
       {
         _id: this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
       }
     );
   };
   ```

# important points

- `this` keyword used in the `bcrypt` and `jwt` code above, refers to to database's data.
  we can access/modify data in mongoDB using `this` keyword in this specific situation and code.
- `.methods` object is attached to `Schema` that we create using mongoose.
  it contains many predefined methods given by mongoose.
  but we can add custom methods into this object and call them.
  always and must use `declarative functions` only for this purpose.
  because we are using `this` and arrow funtions dont have `this`.
  more info is given above at the top.
- mongoose have custom hooks (they are just middlewares), make sure while using these hooks,
  always create callbacks with `declarative functions` only and always provide `next()` in parameter and then at the end of code call `next()`, because hooks are middlewares and middlewares need to call `next()` to resume next code.
- `.isModified()` is already given to us by mongoose, to check if some field is modified or not. it is used in `pre hook` in user.model.js file.
