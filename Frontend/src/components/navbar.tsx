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
        setUser(null);
        navigate('/login');
    }

    return (
        <div className='bg-transparent sticky top-0 px-6 z-30 sm:px-8 md:px-10 backdrop-blur-2xl support-backdrop-blur:bg-white/60 lg:px-12 py-3 border-b border-border/20'>
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
                                        "text-sm  text-foreground px-3 py-1.5 rounded-md transition-colors",
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

                <div className="flex items-center justify-center gap-5">
                    {user && (
                        <Button variant={"ghost"} onClick={logout} aria-label="Log out">
                            <LogOutIcon />
                            <span className="sr-only">Log out</span>
                        </Button>
                    )}                    
                    <ModeToggle />
                    {/* Create Recipe CTA */}
                    <Button onClick={() => navigate('/create-recipe')} className='bg-secondary  hover:bg-secondary/90 cursor-pointer rounded-full font-normal p-4'>
                        <Plus className='size-4 -mr-1 text-secondary-foreground' />
                        <span className='hidden md:block'>Create Recipe</span>
                        <span className='sr-only'>create recipe</span>
                    </Button>

                    {/* user avatar */}
                    {avatarUrl ? (
                        <Avatar className='ring-3 ring-secondary'>
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