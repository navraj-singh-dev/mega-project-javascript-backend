import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { body } from "express-validator";

const router = Router();

router.route("/register").post(
  [
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

    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .toLowerCase(),
    body("fullName").notEmpty().withMessage("Full name is required").trim(),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
      ),
  ],
  registerUser
);

export default router;
