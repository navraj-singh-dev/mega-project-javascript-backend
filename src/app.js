import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// router's import
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";

// endpoint
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

//exports
export { app };
