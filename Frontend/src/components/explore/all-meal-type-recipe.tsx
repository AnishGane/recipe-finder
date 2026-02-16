// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
import RecipeCard from "../recipe-card";
import { Loader2 } from "lucide-react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
import type { Recipe } from "@/types/recipe.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchRecipesByMealType, getMealTypeList } from "@/api/api";



const AllMealTypeRecipe = () => {
    const [activeTab, setActiveTab] = useState("allmealtype");

    const { data, isLoading, error } = useQuery({
        queryKey: ["recipes", activeTab],
        queryFn: () => fetchRecipesByMealType(activeTab),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    const { data: mealTypeList, isLoading: mealTypeLoading, error: mealTypeError } = useQuery({
        queryKey: ["mealTypeList"],
        queryFn: getMealTypeList,
        staleTime: 1000 * 60 * 10,
    })

    const menuTypes = mealTypeList?.mealtypes || [];
    const recipes = data?.recipes || [];

    return (
        <section className="my-10">
            <div className=" pb-2.5 border-b border-border/20">
                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="allmealtype">
                    <TabsList className="gap-3" variant="line">
                        <TabsTrigger value="allmealtype">All Meal Type</TabsTrigger>
                        {mealTypeLoading ? (
                            <div className="flex items-center gap-2 py-2">
                                <Loader2 className="size-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Loading cuisines...</span>
                            </div>
                        ) : mealTypeError ? <p className="text-destructive">{mealTypeError instanceof Error ? mealTypeError.message : "Failed to load cuisines. Please try again."}</p> : (
                            menuTypes?.map((mealType: string) => (
                                <TabsTrigger key={mealType} className="capitalize" value={mealType}>{mealType}</TabsTrigger>
                            ))
                        )}
                    </TabsList>
                </Tabs>
            </div>


            <div>
                <h1 className="mt-8 mb-4 text-3xl text-foreground font-semibold tracking-tight font-sn-pro">
                    {activeTab === "allmealtype"
                        ? "All Meal Type 🍴"
                        : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}🍴`
                    }
                </h1>
                {/* Recipe Grid */}
                <div className="">
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
                            <p className="text-sm mt-2">Try selecting a different category</p>
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

export default AllMealTypeRecipe