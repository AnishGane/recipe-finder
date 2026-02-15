import { API_PATHS } from "@/constants/api-paths";
import axiosInstance from "@/lib/axios-instance";
import type { IAuthContext, IUser } from "@/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setAuthLoading(false);
                return;
            }

            try {
                // backend must verify token
                const res = await axiosInstance.get('/api/auth/me');

                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
            } catch (err) {
                // token invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        initAuth();
    }, []);

    const updateUser = (updatedUser: IUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('vite-ui-theme');
    }

    const register = async (name: string, email: string, password: string, confirmPassword: string, avatar?: File | null) => {
        setLoading(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.append('name', name);
            fd.append('email', email);
            fd.append('password', password);
            fd.append('confirmPassword', confirmPassword);
            // Only append avatar if it exists and is a File
            if (avatar && avatar instanceof File) {
                fd.append('avatar', avatar);
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate("/");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Registration failed. Please try again.";
                setError(errorMessage);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                email,
                password,
            };

            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, payload);

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Login failed. Please try again.";
                setError(errorMessage);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }



    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, navigate, authLoading, updateUser, clearUser, register, login, error, setError }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};