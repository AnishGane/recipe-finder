import type { Response } from "express";
import Recipe from "../models/Recipe.model";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { generateSlug } from "../utils/helper";
import { AuthRequest } from "../types";

// Create a new recipe
export const createRecipe = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      cuisine,
      ingredients,
      instructions,
      tags,
      isPublished,
    } = req.body;

    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSlug = await Recipe.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Handle hero image upload if provided
    let heroImageUrl = "";
    if (req.file) {
      try {
        const result = await uploadImageToCloudinary(req.file.buffer, {
          folder: "recipe-platform/recipes",
          transformation: [
            { width: 1200, height: 800, crop: "fill" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        heroImageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Hero image upload error:", uploadError);
      }
    }

    // Parse ingredients and instructions if they're strings
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
    const parsedInstructions =
      typeof instructions === "string"
        ? JSON.parse(instructions)
        : instructions;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Create recipe
    const recipe = new Recipe({
      userId,
      title,
      slug,
      description,
      heroImage: heroImageUrl,
      prepTime: prepTime ? Number(prepTime) : undefined,
      cookTime: cookTime ? Number(cookTime) : undefined,
      servings: servings ? Number(servings) : 4,
      difficulty: difficulty || "medium",
      cuisine,
      ingredients: parsedIngredients || [],
      instructions: parsedInstructions || [],
      tags: parsedTags || [],
      isPublished: isPublished === "true" || isPublished === true,
      publishedAt:
        isPublished === "true" || isPublished === true ? new Date() : undefined,
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// Get all recipes with filtering
export const getRecipes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      tag,
      cuisine,
      difficulty,
      search,
      userId,
    } = req.query;

    const filter: any = { isPublished: true };

    // Filter by tag
    if (tag && tag !== "allrecipe") {
      filter.tags = tag;
    }

    // Filter by cuisine
    if (cuisine) {
      filter.cuisine = cuisine;
    }

    // Filter by difficulty
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Filter by user
    if (userId) {
      filter.userId = userId;
    }

    // Search by title or description
    if (search) {
      filter.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate("userId", "name username avatar")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// Get single recipe by slug
export const getRecipeBySlug = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const recipe = await Recipe.findOne({ slug, isPublished: true })
      .populate("userId", "name username avatar bio isChef")
      .lean();

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    // Increment view count
    await Recipe.updateOne({ _id: recipe._id }, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

// // Update recipe
// export const updateRecipe = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userId = req.userId;

//     const recipe = await Recipe.findById(id);

//     if (!recipe) {
//       res.status(404).json({ error: "Recipe not found" });
//       return;
//     }

//     // Check if user owns the recipe
//     // if (recipe.userId.toString() !== userId) {
//     //   res.status(403).json({ error: "Not authorized to update this recipe" });
//     //   return;
//     // }

//     // Handle hero image upload if provided
//     if (req.file) {
//       try {
//         const result = await uploadImageToCloudinary(req.file.buffer, {
//           folder: "recipe-platform/recipes",
//           transformation: [
//             { width: 1200, height: 800, crop: "fill" },
//             { quality: "auto" },
//             { fetch_format: "auto" },
//           ],
//         });
//         req.body.heroImage = result.secure_url;
//       } catch (uploadError) {
//         console.error("Hero image upload error:", uploadError);
//       }
//     }

//     // Parse JSON fields if they're strings
//     if (typeof req.body.ingredients === "string") {
//       req.body.ingredients = JSON.parse(req.body.ingredients);
//     }
//     if (typeof req.body.instructions === "string") {
//       req.body.instructions = JSON.parse(req.body.instructions);
//     }
//     if (typeof req.body.tags === "string") {
//       req.body.tags = JSON.parse(req.body.tags);
//     }

//     // Update publishedAt if isPublished is being set to true
//     if (req.body.isPublished && !recipe.isPublished) {
//       req.body.publishedAt = new Date();
//     }

//     const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     }).populate("userId", "name username avatar");

//     res.status(200).json({
//       success: true,
//       message: "Recipe updated successfully",
//       recipe: updatedRecipe,
//     });
//   } catch (error) {
//     console.error("Update recipe error:", error);
//     res.status(500).json({ error: "Failed to update recipe" });
//   }
// };

// // Delete recipe
// export const deleteRecipe = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userId = req.userId;

//     const recipe = await Recipe.findById(id);

//     if (!recipe) {
//       res.status(404).json({ error: "Recipe not found" });
//       return;
//     }

//     // Check if user owns the recipe
//     if (recipe.userId.toString() !== userId) {
//       res.status(403).json({ error: "Not authorized to delete this recipe" });
//       return;
//     }

//     await recipe.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Recipe deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete recipe error:", error);
//     res.status(500).json({ error: "Failed to delete recipe" });
//   }
// };

// Get user's own recipes (drafts and published)
export const getMyRecipes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 12, status } = req.query;

    const filter: any = { userId };

    // Filter by published status
    if (status === "published") {
      filter.isPublished = true;
    } else if (status === "draft") {
      filter.isPublished = false;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get my recipes error:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};
