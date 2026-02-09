import {
  Compass,
  BookOpen,
  FolderKanban,
  Bookmark,
  Users2,
  Youtube,
  Instagram,
  Twitter,
} from "lucide-react";

export const NAV_ITEM = [
  {
    id: "explore",
    name: "Explore",
    link: "/",
    icon: Compass,
  },
  {
    id: "my-cookbook",
    name: "My Cookbook",
    link: "/my-cookbook",
    icon: BookOpen,
  },
  {
    id: "collections",
    name: "Collections",
    link: "/collections",
    icon: FolderKanban,
  },
  {
    id: "saved-recipes",
    name: "Saved Recipes",
    link: "/saved-recipes",
    icon: Bookmark,
  },
  {
    id: "communities",
    name: "Communities",
    link: "/communities",
    icon: Users2,
  },
];

export const FOOTER_LINKS = {
  platform: [
    { label: "Browse Recipes", href: "/recipes" },
    { label: "Top Chefs", href: "/chefs" },
    { label: "Collections", href: "/collections" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Community Guidelines", href: "/guidelines" },
    { label: "Safety", href: "/safety" },
  ],
  social: [
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
  ],
};
