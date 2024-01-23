# Errors solved during debugging

1.

```
  node:internal/errors:496
    ErrorCaptureStackTrace(err);
    ^

    Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\Users\amol\Documents\GitHub\mega-project-javascript-backend\src\routes\user.route' imported from C:\Users\amol\Documents\GitHub\mega-project-javascript-backend\src\app.js
        at new NodeError (node:internal/errors:405:5)
        at finalizeResolution (node:internal/modules/esm/resolve:324:11)
        at moduleResolve (node:internal/modules/esm/resolve:943:10)
        at defaultResolve (node:internal/modules/esm/resolve:1129:11)
        at nextResolve (node:internal/modules/esm/loader:163:28)
        at ESMLoader.resolve (node:internal/modules/esm/loader:835:30)
        at ESMLoader.getModuleJob (node:internal/modules/esm/loader:424:18)
        at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:77:40)
        at link (node:internal/modules/esm/module_job:76:36) {
      code: 'ERR_MODULE_NOT_FOUND'
    }

```

- So, this error is saying me to add `.js` extention manually after i `import` any modules in my code.
- So, i did add this extension and error went away.
- If you import any modules in some files make sure to add `.js` after it manually, otherwise this error will come.

2.

```
file:///C:/Users/amol/Documents/GitHub/mega-project-javascript-backend/src/app.js:19
import { router as userRouter } from "./routes/user.route.js";
         ^^^^^^
SyntaxError: The requested module './routes/user.route.js' does not provide an export named 'router'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:124:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:190:5)

Node.js v18.17.1
```

- So, this error is saying that import statement has wrong syntax,
  and the module (USER.ROUTE.JS) from which i am importing the `router` does not export the `router`.
- So, error is actually not about syntax, it is about understanding of keyword `default` and `{}`.
- In (USER.ROUTE.JS) i am using `default` keyword to export `router`.
  `default` gives me power to import the exported item with whatever name i want,
  but i was importing it using a syntax: `{ router as userRouter }` while using `default`.
- So, the correct way to import a item with any name when `default` keyword is used is to,
  remove `{}` and `as` syntax from `{ router as userRouter }` and simply write it as,
  `userRouter` with no `{}` & `as`.
- If `default` keyword is not used during export, then `{xyz as zyx}` syntax can work.

# Learnings from this instance

- To create `routers` and the specific `controllers` for that router,
  modules will be created in folders named `controllers` & `routes`.
  `Middlewares` for handling `prefix_endpoints` will be created inside module named `app.js`.

- ### Flow of creating routes & controllers in professional and industry settings

  1. **Mostly focus is on folders named:**

  - controllers.
  - routes.
  - other folders like (middleware, utils ) might also be looked upon in some scenarios too.
    mainly 90% of time `controller` & `routes` folders and module named `app.js` are in charge of this flow.

  <br>

  2. **Then focus is on creating modules in these below folders.**
     Like in `controllers folder` for example we might make:

     - user.controller.js
     - paymentGateway.controller.js
     - etc. etc.

     And in `routes folder` for example we might make:

     - user.route.js
     - payment.route.js
     - etc. etc.

     Then from each of these modules,
     It is must to export `router` and `controller function` from each module.
     As they will be imported and used in `app.js`.

  <br>

  3. **Then focus is on `app.js` module in `src` folder:**

  - The exported `routers` are now imported in `app.js` only.
  - Then a middleware is used to make a endpoint,
    (it is partial step, middleware is used to call the imported router when the given endpoint hits).
  - Then the imported `router` is passed as callback to middleware.
    for example in `app.js`:
    ```javascript
    import userRouter from "./routes/user.route.js";
    app.use("/api/v1/users", userRouter);
    ```
  - Adding `/api/v1/prefix_of_route` is a `indusry standard`.
    As it tells we are making a `api` and the version is `v1` or `v2` and so on.
  - So `"/api/v1/users"` is not a complete route,
    Whenever there is a request coming to `"/api/v1/users"` the middleware will immidiately pass control to `userRouter`,
    The middleware will call the imported `userRouter` to pass the control to it.
    Then `router` will handle the remaining task.

  <br>

  4. **Then focus is on `some_random_route_you_created.route.js` modules:**

  - Now, its time to use our `controllers`, we made.
  - In `app.js` only `routers` are imported,
    then we go inside of these router's modules to import & use `contollers`.
  - for example, the code inside of router's module will be:

    ```javascript
    import { Router } from "express";
    import { registerUser } from "../controllers/user.controller.js";

    const router = Router();

    router.route("/register").post(registerUser);

    export default router;
    ```

  - here the `controller function` is `registerUser` that is being used by `router`.
  - Of-Course the `controller function` is imported from another module inside of folder `controllers` in `src`.

  <br>

  5. **The End Of Flow.**

  - now the steps are completed and we are done.

  ### Summary Of Flow & Some Knowledge

  - Our goal is to listen and provide some services & perform some operations on a certain `endpoint/route`.
    Like example can be that, we may want to process online payments on our clothing website,
    on route name `/clothes_payment_processing`.
  - For this, we need to make `middlewares` in app.js, `routers` in different modules.. where modules are created in folder named `routes`,
    `controllers` in different modules.. where modules are inside folder named `controllers`.
  - Now first we need to make this `/clothes_payment_processing` endpoint in `app.js` using `middleware`.
  - Then after that make a `router` inside a module.. where module is inside `routes` folder.
  - Then after that make a `controller` inside a module.. where module is inside `controllers` folder.
  - Then we need to connect the `endpoint` which is in `./app.js` with `router` which is in `./routes/xxxxxxx.router.js` and connect `router` with `controller` which is in `./controllers/xxxxxx.controller.js` to complete this flow.
  - That's it, we are done.

  - #### Industry standard for writing endpoints
    - before writing any endpoints for api,
      add `/api/v1/` before your main endpoint name `/users`.
    - for example:
      - `/api/v1/users/`.
      - why? because it is industry standard.
      - it tells about we are writing endpoints for api.
      - it tells about what is the version of api and its endpoints.
      - it clarifies the code and points for better debugging and understanding of a endpoint.
