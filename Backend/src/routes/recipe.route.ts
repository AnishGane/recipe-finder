import express from "express";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";
import {
  createRecipe,
  getCuisineList,
  getMealTypeList,
  getMyRecipes,
  // getRecipeBySlug,
  getRecipes,
} from "../controllers/recipe.controller";

const recipeRouter = express.Router();

recipeRouter.post("/create", auth, upload.any(), createRecipe);
recipeRouter.get("/", auth, getRecipes);
// Define the more specific route before the slug route so it isn't shadowed
recipeRouter.get("/my/recipes", auth, getMyRecipes);
// recipeRouter.get("/:slug", getRecipeBySlug);
// recipeRouter.put("/:id", auth, upload.single("heroImage"), updateRecipe);
// recipeRouter.delete("/:id", auth, deleteRecipe);

recipeRouter.get("/cuisine-list", getCuisineList);
recipeRouter.get("/mealtype-list", getMealTypeList);
export default recipeRouter;
