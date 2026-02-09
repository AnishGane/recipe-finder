import { Link } from "react-router-dom"
import { Clock, Users, Star, StarIcon, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/types"

interface RecipeCardProps {
    recipe: Recipe
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const totalTime = recipe.prepTime + recipe.cookTime

    return (
        <Link to={`/recipe/${recipe.slug}`}>
            <div className="group bg-card rounded-2xl overflow-hidden ring ring-muted-foreground/30 hover:shadow-lg">
                {/* Recipe Image */}
                <div className="relative h-50 overflow-hidden bg-muted">
                    {/* {recipe.heroImage ? (
                        <img
                            //   src={recipe.heroImage}
                            src="https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )} */}
                    <img
                        //   src={recipe.heroImage}
                        src="https://images.unsplash.com/photo-1603122876935-13e7f40c3984?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Time Badge */}
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-foreground/60 backdrop-blur-xl">
                            <Clock className="size-4" />
                            <span className="text-[11px]">{totalTime} min</span>
                        </Badge>
                    </div>
                </div>

                {/* Recipe Info */}
                <div className="p-4 space-y-2">
                    {/* Title */}
                    <h3 className="font-semibold text-foreground line-clamp-1 ">
                        {recipe.title}
                    </h3>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-1">
                            <StarIcon className="size-4.5 text-secondary fill-secondary" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-muted-foreground/60 text-xs font-medium">(120 reviews)</span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="size-4" />
                                <span>{totalTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="size-4" />
                                <span>{recipe.servings}</span>
                            </div>
                        </div>
                        {recipe.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span>
                                    {recipe.averageRating.toFixed(1)} ({recipe.ratingCount})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="size-8">
                                <AvatarImage src={recipe.userId?.avatar} />
                                <AvatarFallback className="text-xs">
                                    {recipe.userId?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                                {recipe.userId?.name || "Unknown"}
                            </span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // TODO: Implement bookmark toggle logic
                            }}
                            className="hover:text-primary transition-colors"
                            aria-label="Bookmark recipe"
                        >
                            <Bookmark className="size-5" />
                        </button>                    </div>
                </div>
            </div>
        </Link>
    )
}

export default RecipeCard