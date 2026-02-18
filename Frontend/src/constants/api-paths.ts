// Base API URL – defaults to Vite dev server proxy when not set.
// In dev you can leave this empty and rely on the Vite proxy,
// in prod set VITE_BASE_URL to your backend URL.
export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
    CHANGE_PASSWORD: "/api/auth/change-password",
    UPDATE_PROFILE: "/api/auth/update-profile",
  },
  RECIPES: {
    GET_ALL: "/api/recipes",
    GET_BY_SLUG: (slug: string) => `/api/recipes/${slug}`,
    CREATE: "/api/recipes/create",
    UPDATE: (id: string) => `/api/recipes/${id}`,
    DELETE: (id: string) => `/api/recipes/${id}`,
    MY_RECIPES: "/api/recipes/my/recipes",

    GET_CUISINE_LIST: "/api/recipes/cuisine-list",
    GET_MEAL_TYPES: "/api/recipes/mealtype-list",
    SEARCH: "/api/recipes/search",
  },
};
