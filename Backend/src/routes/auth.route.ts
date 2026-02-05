import express from "express";
import * as authController from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";

import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // 5 attempts per window
  message: "Too many attempts, please try again later",
});

const authRouter = express.Router();

authRouter.post(
  "/register",
  authLimiter,
  upload.single("avatar"),
  authController.register
);
authRouter.post("/login", authLimiter, authController.login);
authRouter.get("/me", auth, authController.getMe);
authRouter.post("/change-password", auth, authController.changePassword);
authRouter.put("/update-profile", auth, authController.updateProfile);

export default authRouter;
