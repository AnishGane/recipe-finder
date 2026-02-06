import {
  Compass,
  BookOpen,
  FolderKanban,
  Bookmark,
  Users2,
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
