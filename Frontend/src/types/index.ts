import type React from "react";
import type { NavigateFunction } from "react-router-dom";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  avatar?: string | null;
  bio?: string;
  isChef: boolean;
  specialties: string[];
  followingIds: string[];
  followerIds: string[];
  followerCount: number;
  followingCount: number;
  recipeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  authLoading: boolean;
  updateUser: (updatedUser: IUser) => void;
  clearUser: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    avatar?: File | null,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

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
