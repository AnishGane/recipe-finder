import { AuthRequest } from "../types";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

interface JWTPayload {
  userId: string;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).send({ error: "No User found." });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
