import mongoose from "mongoose";
import { ICollection } from "../types";

const collectionSchema = new mongoose.Schema<ICollection>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    recipeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  {
    timestamps: true,
  }
);

collectionSchema.index({ userId: 1 });

const Collection = mongoose.model<ICollection>("Collection", collectionSchema);
export default Collection;
