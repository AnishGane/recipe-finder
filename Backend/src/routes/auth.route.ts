import express from "express";
import * as authController from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";

const authRouter = express.Router();

authRouter.post("/register", upload.single("avatar"), authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", auth, authController.getMe);
authRouter.post("/change-password", auth, authController.changePassword);
authRouter.put("/update-profile", auth, authController.updateProfile);

export default authRouter;
