import { Types } from "mongoose";
import RecipeLike from "../models/RecipeLike.model";
import RecipeSave from "../models/RecipeSave.model";

/**
 * Like operations - use RecipeLike model instead of Recipe.likedBy array
 */
export const addLike = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeLike.create({ recipe: recipeId, user: userId });

export const removeLike = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeLike.deleteOne({ recipe: recipeId, user: userId });

export const getLikeCount = (recipeId: Types.ObjectId) =>
  RecipeLike.countDocuments({ recipe: recipeId });

export const isLiked = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeLike.findOne({ recipe: recipeId, user: userId }).then((doc) => !!doc);

/**
 * Save operations - use RecipeSave model instead of Recipe.savedBy array
 */
export const addSave = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeSave.create({ recipe: recipeId, user: userId });

export const removeSave = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeSave.deleteOne({ recipe: recipeId, user: userId });

export const getSaveCount = (recipeId: Types.ObjectId) =>
  RecipeSave.countDocuments({ recipe: recipeId });

export const isSaved = (recipeId: Types.ObjectId, userId: Types.ObjectId) =>
  RecipeSave.findOne({ recipe: recipeId, user: userId }).then((doc) => !!doc);
