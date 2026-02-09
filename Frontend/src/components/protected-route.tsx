import { useAuth } from '@/context/auth-context'
import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import Navbar from './navbar';
import MobileBottomNav from './mobile-bottom-nav';
import Footer from './footer';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    // If no user (not authenticated), redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <>
            <Navbar />
            <MobileBottomNav />
            <div className='px-4 sm:px-8 md:px-10 lg:px-12 py-6'>{children}</div>
            <Footer />
        </>
    )
}

export default ProtectedRoute