import { Request } from "express";
import { Document, Types } from "mongoose";

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

export interface IIngredient {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
}

export interface IInstruction {
  step: number;
  description: string;
  image?: string;
  duration?: number;
}

export interface IRecipe extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  heroImage?: string;
  prepTime?: number;
  cookTime?: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  cuisine?:
    | "italian"
    | "chinese"
    | "indian"
    | "mexican"
    | "japanese"
    | "french"
    | "thai"
    | "greek"
    | "american"
    | "mediterranean"
    | "other";
  ingredients: IIngredient[];
  instructions: IInstruction[];
  tags: string[];
  ratings: Map<string, number>;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  isPublished: boolean;
  publishedAt?: Date;
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

export interface IRecipeLike extends Document {
  recipe: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipeSave extends Document {
  recipe: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: Types.ObjectId;
}
