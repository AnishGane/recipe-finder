import type { RequestHandler } from "express";
import type { AuthRequest } from "../types";
import jwt from "jsonwebtoken";
import User from "../models/User.model";

interface JWTPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export const auth: RequestHandler = async (req, res, next) => {
  try {
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ error: "Internal server error" });
    }
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).send({ error: "No User found." });
    }

    const authReq = req as AuthRequest;
    authReq.user = user;
    authReq.userId = user._id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
