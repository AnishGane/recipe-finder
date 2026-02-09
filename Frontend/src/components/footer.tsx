import { FOOTER_LINKS } from "@/constants"
import { CookingPot } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/20 border-t border-border/20 py-12">
            <div className="w-full px-4 sm:px-8 md:px-10 lg:px-12 py-6 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-between">
                    {/* Brand Section */}
                    <div className="max-w-md w-full">
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
                        <p className="text-sm mt-3.5 text-foreground/80">
                            The world's largest community for home cooks to discover and share amazing recipes.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
                        {/* Platform Links */}
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                            <ul className="space-y-2 ">
                                {FOOTER_LINKS.platform.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-foreground/80 hover:text-secondary font-sn-pro transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Support</h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.support.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-foreground/80 font-sn-pro hover:text-secondary transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="place-items-center">
                        <h4 className="font-semibold text-foreground mb-4">Social</h4>
                        <div className="flex gap-3">
                            {FOOTER_LINKS.social.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        aria-label={link.label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground/80 hover:text-secondary transition-colors"
                                    >
                                        <Icon className="size-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div>
                <p className="text-xs text-foreground/80 text-center">
                    © {currentYear} Flavourly Inc. All rights reserved. Built for food lovers everywhere.
                </p>
            </div>

        </footer >
    )
}

export default Footer