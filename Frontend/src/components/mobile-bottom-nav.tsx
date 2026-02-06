// components/mobile-bottom-nav.tsx
import { NavLink } from "react-router-dom";
import { NAV_ITEM } from "@/constants";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <ul className="grid grid-cols-5 gap-3 justify-around px-4 py-2">
                {NAV_ITEM.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <NavLink
                                to={item.link}
                                aria-label={item.name}
                                className={({ isActive }) =>
                                    cn(
                                        "flex flex-col items-center justify-center p-2 py-3 rounded-md transition-all",
                                        isActive
                                            ? "bg-accent text-muted rounded-full"
                                            : "text-muted-foreground hover:text-foreground"
                                    )
                                }
                            >
                                <Icon className="size-5" />
                                <span className="sr-only">{item.name}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
