import type { RequestHandler } from "express";
import Recipe from "../models/Recipe.model";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { escapeRegex, generateSlug } from "../utils/helper";
import { AuthRequest, CloudinaryUploadResult } from "../types";
import { IngredientInput, InstructionInput } from "../types/recipe.type";
import {
  getHeroImage,
  getInstructionImages,
  getUploadedFiles,
} from "../middlewares/multer";

// Create a new recipe
export const createRecipe: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
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
      mealType,
    } = req.body;

    const userId = authReq.userId;

    // Validation
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

    // Extract uploaded files using helper
    const uploadedFiles = getUploadedFiles(req.files);
    const heroImageFile = getHeroImage(uploadedFiles);
    const instructionImageFiles = getInstructionImages(uploadedFiles);

    // Handle hero image upload
    let heroImageUrl = "";
    if (heroImageFile) {
      try {
        const result: CloudinaryUploadResult = await uploadImageToCloudinary(
          heroImageFile.buffer,
          {
            folder: "recipe-platform/recipes",
            transformation: [
              { width: 1200, height: 800, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
        );
        heroImageUrl = result.secure_url;
        console.log("Hero image uploaded:", heroImageUrl);
      } catch (uploadError) {
        console.error("Hero image upload error:", uploadError);
        res.status(500).json({ error: "Failed to upload hero image" });
        return;
      }
    }

    // Parse ingredients, instructions, and tags
    let parsedIngredients: IngredientInput[];
    let parsedInstructions: InstructionInput[];
    let parsedTags: string[];

    try {
      parsedIngredients =
        typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

      parsedInstructions =
        typeof instructions === "string"
          ? JSON.parse(instructions)
          : instructions;

      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      res.status(400).json({
        error: "Invalid JSON format in ingredients, instructions, or tags",
      });
      return;
    }

    // Handle instruction images upload
    if (instructionImageFiles.length > 0 && parsedInstructions) {
      try {
        console.log(
          `Uploading ${instructionImageFiles.length} instruction images...`,
        );

        // Create upload promises for each image
        const imageUploadPromises = instructionImageFiles.map(async (file) => {
          // Extract the index from fieldname like "instructionImages[2]"
          const indexMatch = file.fieldname.match(/\[(\d+)\]/);
          const stepIndex = indexMatch ? parseInt(indexMatch[1]) : -1;

          if (stepIndex === -1) {
            console.warn(
              `Could not parse index from fieldname: ${file.fieldname}`,
            );
            return null;
          }

          try {
            const result: CloudinaryUploadResult =
              await uploadImageToCloudinary(file.buffer, {
                folder: "recipe-platform/instructions",
                transformation: [
                  { width: 800, height: 600, crop: "fill" },
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
                public_id: `instruction-${slug}-step-${stepIndex}-${Date.now()}`,
              });

            console.log(
              `Uploaded instruction image for step ${stepIndex}:`,
              result.secure_url,
            );

            return {
              stepIndex,
              url: result.secure_url,
            };
          } catch (uploadError) {
            console.error(
              `Failed to upload instruction image for step ${stepIndex}:`,
              uploadError,
            );
            return null;
          }
        });

        // Wait for all uploads to complete
        const uploadResults = await Promise.all(imageUploadPromises);

        // Map uploaded images to their corresponding instructions
        uploadResults.forEach((result) => {
          if (result && parsedInstructions[result.stepIndex]) {
            parsedInstructions[result.stepIndex].image = result.url;
          }
        });

        console.log("All instruction images uploaded successfully");
      } catch (uploadError) {
        console.error("Instruction images upload error:", uploadError);
        // Continue with recipe creation even if some images fail
      }
    }

    // Create recipe document
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
      mealType,
      ingredients: parsedIngredients || [],
      instructions: parsedInstructions || [],
      tags: parsedTags || [],
      isPublished: isPublished === "true" || isPublished === true,
      publishedAt:
        isPublished === "true" || isPublished === true ? new Date() : undefined,
    });

    await recipe.save();

    console.log("Recipe created successfully:", recipe._id);

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({
      error: "Failed to create recipe",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all recipes with filtering
export const getRecipes: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      cuisine,
      difficulty,
      userId,
      mealType,
    } = req.query;

    const filter: any = { isPublished: true };

    // Filter by mealType
    if (mealType) {
      filter.mealType = mealType;
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

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 12),
    );
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

export const getCuisineList: RequestHandler = async (req, res) => {
  try {
    const cuisines = await Recipe.distinct("cuisine", {
      isPublished: true,
      cuisine: { $exists: true, $ne: null },
    });
    res.status(200).json({
      success: true,
      cuisines,
    });
  } catch (error) {
    console.error("Get cuisines error:", error);
    res.status(500).json({ error: "Failed to fetch cuisines" });
  }
};

export const getMealTypeList: RequestHandler = async (req, res) => {
  try {
    const mealtypes = await Recipe.distinct("mealType", {
      isPublished: true,
      mealType: { $exists: true, $ne: null },
    });
    res.status(200).json({
      success: true,
      mealtypes,
    });
  } catch (error) {
    console.error("Get mealtypes error:", error);
    res.status(500).json({ error: "Failed to fetch mealtypes" });
  }
};

// Get single recipe by slug
// export const getRecipeBySlug = async (
//   req: AuthRequest,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { slug } = req.params;

//     const recipe = await Recipe.findOne({ slug, isPublished: true })
//       .populate("userId", "name username avatar bio isChef")
//       .lean();

//     if (!recipe) {
//       res.status(404).json({ error: "Recipe not found" });
//       return;
//     }

//     // Increment view count
//     await Recipe.updateOne({ _id: recipe._id }, { $inc: { viewCount: 1 } });

//     res.status(200).json({
//       success: true,
//       recipe,
//     });
//   } catch (error) {
//     console.error("Get recipe error:", error);
//     res.status(500).json({ error: "Failed to fetch recipe" });
//   }
// };

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
export const getMyRecipes: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId;
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

export const searchRecipes: RequestHandler = async (req, res) => {
  try {
    const {
      q, // search query
      cuisine,
      mealType,
      difficulty,
      prepTimeMax,
      cookTimeMax,
      tags,
      minRating,
      sortBy = "relevance", // relevance, newest, rating, popular
      page = 1,
      limit = 12,
    } = req.query;

    const filter: any = { isPublished: true };

    // Text search (title, description, ingredients)
    if (q) {
      const escapedQuery = escapeRegex(q as string);
      filter.$or = [
        { title: { $regex: escapedQuery, $options: "i" } },
        { description: { $regex: escapedQuery, $options: "i" } },
        { tags: { $regex: escapedQuery, $options: "i" } },
        { "ingredients.name": { $regex: escapedQuery, $options: "i" } },
      ];
    }

    // Filter by cuisine
    if (cuisine && cuisine !== "all") {
      filter.cuisine = cuisine;
    }

    // Filter by meal type
    if (mealType && mealType !== "all") {
      filter.mealType = mealType;
    }
    // Filter by difficulty
    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    // Filter by prep time
    if (prepTimeMax) {
      const val = Number(prepTimeMax);
      if (!Number.isNaN(val)) filter.prepTime = { $lte: val };
    }

    // Filter by cook time
    if (cookTimeMax) {
      const val = Number(cookTimeMax);
      if (!Number.isNaN(val)) filter.cookTime = { $lte: val };
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Filter by minimum rating
    if (minRating) {
      const val = Number(minRating);
      if (!Number.isNaN(val)) filter.averageRating = { $gte: val };
    }

    // Sorting
    let sort: any = {};
    switch (sortBy) {
      case "newest":
        sort = { publishedAt: -1 };
        break;
      case "rating":
        sort = { averageRating: -1, ratingCount: -1 };
        break;
      case "popular":
        sort = { viewCount: -1 };
        break;
      case "quickest":
        sort = { cookTime: 1, prepTime: 1 };
        break;
      default:
        sort = { publishedAt: -1 }; // relevance (can add text score later)
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 12),
    );
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate("userId", "name username avatar")
        .sort(sort)
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
      filters: {
        q,
        cuisine,
        mealType,
        difficulty,
        prepTimeMax,
        cookTimeMax,
        tags,
        minRating,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Search recipes error:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
};
