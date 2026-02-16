import { API_PATHS } from "@/constants/api-paths";
import axiosInstance from "@/lib/axios-instance";
import type { RecipesResponse } from "@/types/recipe.type";

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
