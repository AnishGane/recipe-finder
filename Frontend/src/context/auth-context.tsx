import { API_PATHS } from "@/constants/api-paths";
import axiosInstance from "@/lib/axios-instance";
import type { IAuthContext, IUser, TFormData } from "@/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [formData, setFormData] = useState<TFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        avatar: null,

    });
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
    }

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    // Handle avatar file separately
                    if (key === "avatar" && value instanceof File) {
                        fd.append(key, value);
                    }
                    // Handle arrays (specialties, followingIds, etc.)
                    else if (Array.isArray(value)) {
                        fd.append(key, JSON.stringify(value));
                    }
                    // Handle other values
                    else {
                        fd.append(key, String(value));
                    }
                }
            });

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, fd,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // console.log("Registration successful:", response.data);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                setFormData({});
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

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send JSON for login – backend expects a JSON body
            const payload = {
                email: formData.email,
                password: formData.password,
            };

            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, payload);
            // console.log("Login successful:", response.data);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setUser(response.data.user);
                setFormData({});
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
        <AuthContext.Provider value={{ user, setUser, formData, setFormData, loading, setLoading, navigate, authLoading, updateUser, clearUser, register, login, error, setError }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};