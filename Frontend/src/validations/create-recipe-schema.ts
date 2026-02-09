import { DIFFICULTY_LEVELS } from "@/constants";
import { z } from "zod";
// Zod Schema
export const ingredientSchema = z.object({
    qty: z.string().min(1, "Quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    name: z.string().min(1, "Ingredient name is required"),
});

export const instructionSchema = z.object({
    step: z.number(),
    description: z.string().min(10, "Instruction must be at least 10 characters"),
    image: z.string().nullable(),
    duration: z.number(),
});

export const recipeFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description is too long"),
    prepTime: z.string().min(1, "Prep time is required"),
    cookTime: z.string().min(1, "Cook time is required"),
    difficulty: z.enum(DIFFICULTY_LEVELS),
    servings: z.string().min(1, "Servings is required"),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    instructions: z.array(instructionSchema).min(1, "At least one instruction is required"),
    cuisines: z.array(z.string()),
    mealTypes: z.array(z.string()),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;