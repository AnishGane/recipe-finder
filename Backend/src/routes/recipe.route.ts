import express from "express";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";
import {
  createRecipe,
  getMyRecipes,
  getRecipeBySlug,
  getRecipes,
} from "../controllers/recipe.controller";

const recipeRouter = express.Router();

recipeRouter.post("/create", auth, upload.single("heroImage"), createRecipe);
recipeRouter.get("/", auth, getRecipes);
recipeRouter.get("/:slug", getRecipeBySlug);
recipeRouter.get("/my/recipes", auth, getMyRecipes);
// recipeRouter.put("/:id", auth, upload.single("heroImage"), updateRecipe);
// recipeRouter.delete("/:id", auth, deleteRecipe);
export default recipeRouter;
