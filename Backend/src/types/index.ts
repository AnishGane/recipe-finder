import type { Request } from "express";
import type { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  isChef: boolean;
  specialties: string[];
  followingIds: Types.ObjectId[];
  followerIds: Types.ObjectId[];
  followerCount: number;
  followingCount: number;
  recipeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollection extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  isPublic: boolean;
  recipeIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: Types.ObjectId;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  width: number;
  height: number;
  bytes: number;
}
