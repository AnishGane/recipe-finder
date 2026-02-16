import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import RecipeCard from "../recipe-card";
import { fetchRecipesByCuisine, getCuisineList } from "@/api/api";
import type { Recipe } from "@/types/recipe.type";

const RecipeByCuisine = () => {
    const [activeCuisineTab, setActiveCuisineTab] = useState("allcuisine");

    const { data, isLoading, error } = useQuery({
        queryKey: ["recipes", activeCuisineTab],
        queryFn: () => fetchRecipesByCuisine(activeCuisineTab),
        staleTime: 1000 * 60 * 5,
    })

    const { data: cuisineListData, isLoading: cuisineLoading } = useQuery({
        queryKey: ["cuisineList"],
        queryFn: getCuisineList,
        staleTime: 1000 * 60 * 10, // 10 minutes - cuisines change less frequently
    })

    const recipes = data?.recipes || []
    const cuisineList = cuisineListData?.cuisines || []

    return (
        <section className="my-10">
            <div className="pb-2.5 border-b border-border/20">
                {cuisineLoading ? (
                    <div className="flex items-center gap-2 py-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading cuisines...</span>
                    </div>
                ) : (
                    <Tabs value={activeCuisineTab} onValueChange={setActiveCuisineTab}>
                        <TabsList className="gap-3" variant="line">
                            <TabsTrigger value="allcuisine">All Cuisines</TabsTrigger>
                            {cuisineList.map((cuisine: string) => (
                                <TabsTrigger
                                    key={cuisine}
                                    value={cuisine}
                                    className="capitalize"
                                >
                                    {cuisine}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                )}
            </div>

            <div className="col-span-4">
                <h1 className="mt-8 mb-4 text-3xl text-foreground font-semibold tracking-tight">
                    {activeCuisineTab === "allcuisine"
                        ? "All Cuisines 🍽️"
                        : `${activeCuisineTab.charAt(0).toUpperCase() + activeCuisineTab.slice(1)} Cuisine 🍽️`
                    }
                </h1>

                {/* Recipe Grid */}
                <div>
                    {isLoading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Loader2 className="size-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <p className="text-destructive">
                                {error instanceof Error ? error.message : "Failed to load recipes. Please try again."}
                            </p>
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                            <p className="text-lg">No recipes found</p>
                            <p className="text-sm mt-2">Try selecting a different cuisine</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recipes.slice(0, 8).map((recipe: Recipe) => (
                                <RecipeCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default RecipeByCuisine