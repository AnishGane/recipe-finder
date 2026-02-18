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

export const CUISINES = [
  "Italian",
  "Chinese",
  "Indian",
  "Mexican",
  "Japanese",
  "French",
  "Thai",
  "Greek",
  "American",
  "Mediterranean",
  "Other",
] as const;

export const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
] as const;

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"] as const;


export const TRENDING_TAGS = [
  "vegan",
  "healthy",
  "summerfood",
  "soupseason",
  "lowcarb",
  "highprotein",
  "glutenfree",
  "keto",
  "quickmeals",
];

export const TOP_CHEFS = [
  {
    image:
      "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Chef Gordon",
    followers: "12K",
  },
  {
    image:
      "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Chef Ramsey",
    followers: "12K",
  },
  {
    image:
      "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Mike Smith",
    followers: "12K",
  },
];
