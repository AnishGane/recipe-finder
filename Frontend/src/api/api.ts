import { API_PATHS } from "@/constants/api-paths";
import axiosInstance from "@/lib/axios-instance";
import type { RecipesResponse, SearchFilters } from "@/types/recipe.type";

export const fetchRecipesByMealType = async (
  mealType: string,
): Promise<RecipesResponse> => {
  const params: Record<string, string> = {};

  if (mealType !== "allmealtype") {
    params.mealType = mealType;
  }

  const response = await axiosInstance.get(API_PATHS.RECIPES.GET_ALL, {
    params,
  });

  return response.data;
};

export const fetchRecipesByCuisine = async (
  cuisine: string,
): Promise<RecipesResponse> => {
  const params: Record<string, string> = {};

  if (cuisine !== "allcuisine") {
    params.cuisine = cuisine;
  }

  const response = await axiosInstance.get(API_PATHS.RECIPES.GET_ALL, {
    params,
  });

  return response.data;
};

export const createRecipe = async (data: FormData) => {
  const response = await axiosInstance.post(API_PATHS.RECIPES.CREATE, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getCuisineList = async () => {
  const response = await axiosInstance.get(API_PATHS.RECIPES.GET_CUISINE_LIST);
  return response.data;
};
export const getMealTypeList = async () => {
  const response = await axiosInstance.get(API_PATHS.RECIPES.GET_MEAL_TYPES);
  return response.data;
};

export const searchRecipes = async (filters: SearchFilters) => {
  const params: Record<string, string> = {};

  // Only add non-default values
  if (filters.q) params.q = filters.q;
  if (filters.cuisine && filters.cuisine !== "all")
    params.cuisine = filters.cuisine;
  if (filters.mealType && filters.mealType !== "all")
    params.mealType = filters.mealType;
  if (filters.difficulty && filters.difficulty !== "all")
    params.difficulty = filters.difficulty;
  if (filters.prepTimeMax && filters.prepTimeMax !== 120)
    params.prepTimeMax = filters.prepTimeMax.toString();
  if (filters.cookTimeMax && filters.cookTimeMax !== 180)
    params.cookTimeMax = filters.cookTimeMax.toString();
  if (filters.minRating && filters.minRating !== 0)
    params.minRating = filters.minRating.toString();
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.page) params.page = filters.page.toString();
  if (filters.limit) params.limit = filters.limit.toString();

  const response = await axiosInstance.get(API_PATHS.RECIPES.SEARCH, {
    params,
  });

  return response.data;
};
