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

// const TRENDING_TAGS = ["vegan", "healthy", "summerfood", "soupseason", "lowcarb", "highprotein", "glutenfree", "keto", "quickmeals"];

// const TOP_CHEFS = [
//     { image: "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Chef Gordon", followers: "12K" },
//     { image: "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Chef Ramsey", followers: "12K" },
//     { image: "https://images.unsplash.com/photo-1597692493647-25bd4240a3f2?q=80&w=1003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", name: "Mike Smith", followers: "12K" },
// ]

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
            {/* <div className="md:mt-12 flex items-center flex-col gap-6">
                <Card className="border-none ring-ring/30 ring ">
                    <CardHeader>
                        <CardTitle className="font-semibold text-lg">
                            Trending Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex -mt-4 flex-wrap gap-x-3 gap-y-2">
                        {TRENDING_TAGS.map((tag) => (
                            <Button key={tag} className="bg-secondary/10 rounded-xl cursor-pointer" variant="ghost">{"#" + tag}</Button>
                        ))}
                    </CardContent>
                </Card>
                <Card className="border-none ring-ring/30 ring ">
                    <CardHeader>
                        <CardTitle className="font-semibold text-lg">
                            Top Chefs to Follow
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex -mt-4 flex-wrap gap-3">
                        {TOP_CHEFS.map((chef) => (
                            <div className="flex items-center justify-between  w-full">
                                <div className="flex gap-3">
                                    <img src={chef.image} alt="chef image" className="size-11 rounded-full" />
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-semibold">{chef.name}</h4>
                                        <p className="text-xs text-muted-foreground/80">{chef.followers} Followers</p>
                                    </div>
                                </div>
                                <span className="text-secondary font-medium text-sm">Follow</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none ring-ring/60 w-full ring bg-secondary/15">
                    <CardHeader>
                        <CardTitle className="font-semibold text-lg">Weekly Inspiration</CardTitle>
                        <CardDescription className="text-xs">Get the best hand-picked recipes delivered to your inbox every Sunday morning.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="Your email" className="w-full bg-input text-foreground rounded-lg placeholder:text-foreground/50 placeholder:font-medium" />
                        <Button className="w-full cursor-pointer rounded-lg mt-4" variant="secondary">Subscribe</Button>
                    </CardContent>
                </Card>
            </div> */}
        </section>
    )
}

export default AllMealTypeRecipe