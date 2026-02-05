import type React from "react";
import type { NavigateFunction } from "react-router-dom";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  avatar?: string | File | null;
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

export type TFormData = Partial<Omit<IUser, "_id" | "createdAt" | "updatedAt">>;

export interface IAuthContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  formData: TFormData;
  setFormData: React.Dispatch<React.SetStateAction<TFormData>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  authLoading: boolean;
  updateUser: (updatedUser: IUser) => void;
  clearUser: () => void;
  register: (e: React.FormEvent) => Promise<void>;
  login: (e: React.FormEvent) => Promise<void>;
}
