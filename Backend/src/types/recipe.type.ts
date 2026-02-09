import type { Express } from "express";
import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IIngredient {
  name: string;
  quantity?: number;
  unit?: string;
  // notes?: string;
}

// Multer's files type when using upload.fields()
export interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

// Ingredient and Instruction types
export interface IngredientInput {
  name: string;
  quantity: number;
  unit: string;
}

export interface InstructionInput {
  step: number;
  description: string;
  duration: number;
  image?: string | null;
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
  instructions: InstructionInput[];
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
