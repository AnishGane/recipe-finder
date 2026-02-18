import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { CookingPot, LogOutIcon, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/context/auth-context'
import { ModeToggle } from './mode-switcher'
import { cn } from '@/lib/utils'
import { NavLink } from "react-router-dom";
import { NAV_ITEM } from '@/constants'

const Navbar = () => {
    const { user, setUser, navigate } = useAuth();
    const avatarUrl = user?.avatar || undefined;

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('vite-ui-theme'); // Clear theme on logout
        setUser(null);
        navigate('/login');
    }

    return (
        <div className='bg-white dark:bg-transparent sticky top-0 px-6 z-30 sm:px-8 md:px-10 backdrop-blur-2xl support-backdrop-blur:bg-white/60 lg:px-12 py-3 border-b border-border/10'>
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to={"/"}>
                    <div className='flex items-center gap-2'>
                        <div className="bg-secondary text-white flex size-6 items-center justify-center rounded-sm">
                            <CookingPot className="size-4" />
                        </div>
                        <span className='[html.dark_&]:text-white font-medium [html.light_&]:text-black'>
                            Flavourly
                        </span>
                    </div>
                </Link>

                <ul className='hidden md:flex items-center gap-6 justify-center'>
                    {NAV_ITEM.map((item) => (
                        <li key={item.id}>
                            <NavLink
                                to={item.link}
                                className={({ isActive }) =>
                                    cn(
                                        "text-sm  text-foreground px-3 py-2 rounded-md transition-colors",
                                        isActive && "bg-accent/75 text-muted",
                                        !isActive && "hover:bg-accent/10"
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>

                    ))}
                </ul>

                <div className="flex items-center justify-center gap-3">
                    <ModeToggle />
                    {user && (
                        <Button variant={"ghost"} onClick={logout} aria-label="Log out" className='rounded-full hover:bg-red-500/60! hover:text-background cursor-pointer text-foreground'>
                            <LogOutIcon />
                            <span className="sr-only">Log out</span>
                        </Button>
                    )}
                    {/* Create Recipe CTA */}
                    <Button onClick={() => navigate('/create-recipe')} variant={"ghost"} className='hover:bg-muted-foreground/10! rounded-full hover:text-foreground cursor-pointer text-foreground'>
                        <Plus className='size-4' />
                        <span className='sr-only'>create recipe</span>
                    </Button>

                    {/* user avatar */}
                    {avatarUrl ? (
                        <Avatar className='ring-2 ring-secondary'>
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>
                                {user?.name?.charAt(0).toUpperCase() || "FL"}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div>
                            hello
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Navbar