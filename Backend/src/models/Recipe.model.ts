import mongoose from "mongoose";
import { IIngredient, IRecipe } from "../types";

const ingredientSchema = new mongoose.Schema<IIngredient>({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
},{_id: false});

const instructionSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String },
  duration: { type: Number },
},{_id: false});

const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    heroImage: {
      type: String,
    },
    prepTime: {
      type: Number, // in minutes
    },
    cookTime: {
      type: Number, // in minutes
    },
    servings: {
      type: Number,
      default: 4,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    cuisine: {
      type: String,
      enum: [
        "italian",
        "chinese",
        "indian",
        "mexican",
        "japanese",
        "french",
        "thai",
        "greek",
        "american",
        "mediterranean",
        "other",
      ],
    },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    tags: [
      {
        type: String,
      },
    ],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: {
      type: Map,
      of: Number,
      default: {},
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    saveCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.index({ title: "text", description: "text" });
recipeSchema.index({ userId: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ isPublished: 1, publishedAt: -1 });

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
