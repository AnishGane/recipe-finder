import { API_PATHS } from "@/constants/api-paths";
import axiosInstance from "@/lib/axios-instance";
import type { RecipesResponse } from "@/types";

export const fetchRecipesByTag = async (tag: string): Promise<RecipesResponse> => {
  const params: any = { limit: 12 };

  if (tag !== "allrecipe") {
    params.tag = tag;
  }

  const response = await axiosInstance.get(API_PATHS.RECIPES.GET_ALL, {
    params,
  });

  return response.data;
};
