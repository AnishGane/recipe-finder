import mongoose from "mongoose";
import { IRecipeLike } from "../types";

const recipeLikeSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Unique compound index: one like per user per recipe
recipeLikeSchema.index({ recipe: 1, user: 1 }, { unique: true });
// Index on recipe for fast counts and queries
recipeLikeSchema.index({ recipe: 1 });
// Index on user for "recipes liked by user" queries
recipeLikeSchema.index({ user: 1 });

const RecipeLike = mongoose.model<IRecipeLike>("RecipeLike", recipeLikeSchema);
export default RecipeLike;
