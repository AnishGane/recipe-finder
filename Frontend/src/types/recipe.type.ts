export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  description: string;
  heroImage?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  tags: string[];
  averageRating: number;
  ratingCount: number;
  userId: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

export interface RecipesResponse {
  success: boolean;
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Extended type to track instruction image files
export interface InstructionImageFile {
  index: number;
  file: File;
  preview: string;
}

export interface SearchFilters {
  q: string;
  cuisine?: string;
  mealType?: string;
  difficulty?: string;
  prepTimeMax?: number;
  cookTimeMax?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}
