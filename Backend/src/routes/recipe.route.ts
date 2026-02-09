import express from "express";
import { auth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";
import {
  createRecipe,
  getMyRecipes,
  // getRecipeBySlug,
  getRecipes,
} from "../controllers/recipe.controller";

const recipeRouter = express.Router();

recipeRouter.post(
  "/create",
  auth,
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "instructionImages", maxCount: 10 },
  ]),
  createRecipe,
);
recipeRouter.get("/", auth, getRecipes);
// Define the more specific route before the slug route so it isn't shadowed
recipeRouter.get("/my/recipes", auth, getMyRecipes);
// recipeRouter.get("/:slug", getRecipeBySlug);
// recipeRouter.put("/:id", auth, upload.single("heroImage"), updateRecipe);
// recipeRouter.delete("/:id", auth, deleteRecipe);
export default recipeRouter;
