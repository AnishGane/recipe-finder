import mongoose from "mongoose";
import { IIngredient, IRecipe } from "../types";
import RecipeLike from "./RecipeLike.model";
import RecipeSave from "./RecipeSave.model";

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
    ratings: {
      type: Map,
      of: Number,
      default: {},
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

// Referential cleanup: when a Recipe is deleted, remove all RecipeLike and RecipeSave entries
const cleanupRecipeLikesAndSaves = async (recipeId: mongoose.Types.ObjectId) => {
  await RecipeLike.deleteMany({ recipe: recipeId });
  await RecipeSave.deleteMany({ recipe: recipeId });
};

recipeSchema.pre("deleteOne", { document: true, query: false }, async function () {
  await cleanupRecipeLikesAndSaves(this._id);
});

recipeSchema.pre("deleteOne", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean();
  if (doc) {
    await cleanupRecipeLikesAndSaves(doc._id);
  }
});

recipeSchema.pre("findOneAndDelete", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean();
  if (doc) {
    await cleanupRecipeLikesAndSaves(doc._id);
  }
});

recipeSchema.pre("deleteMany", { document: false, query: true }, async function () {
  const docs = await this.model.find(this.getFilter()).select("_id").lean();
  if (docs.length > 0) {
        const recipeIds = docs.map((doc) => doc._id);
        await Promise.all([
          RecipeLike.deleteMany({ recipe: { $in: recipeIds } }),
          RecipeSave.deleteMany({ recipe: { $in: recipeIds } }),
        ]);
      }
});

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);
export default Recipe;
