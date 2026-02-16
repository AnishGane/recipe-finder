import AllMealTypeRecipe from "@/components/explore/all-meal-type-recipe"
import HeroBanner from "@/components/explore/hero-banner"
import RecipeByCuisine from "@/components/explore/recipe-by-cuisines"

const Explore = () => {
    return (
        <>
            <HeroBanner />
            <div className="flex">
                <div>
                    <AllMealTypeRecipe />
                    <RecipeByCuisine />
                </div>
            </div>
        </>
    )
}

export default Explore