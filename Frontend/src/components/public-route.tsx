import { useAuth } from "@/context/auth-context";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, authLoading } = useAuth();

    // Show loading spinner while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    // If user is already authenticated, redirect to home
    if (user) {
        return <Navigate to="/" replace />;
    }

    // User is not authenticated, render the public content (login/signup)
    return <>{children}</>;
};