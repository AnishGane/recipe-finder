import mongoose from "mongoose";
import { IRecipeSave } from "../types";

const recipeSaveSchema = new mongoose.Schema(
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

// Unique compound index: one save per user per recipe
recipeSaveSchema.index({ recipe: 1, user: 1 }, { unique: true });
// Index on recipe for fast counts and queries
recipeSaveSchema.index({ recipe: 1 });
// Index on user for "recipes saved by user" queries
recipeSaveSchema.index({ user: 1 });

const RecipeSave = mongoose.model<IRecipeSave>("RecipeSave", recipeSaveSchema);
export default RecipeSave;
