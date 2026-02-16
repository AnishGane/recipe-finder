import AllMealTypeRecipe from "@/components/explore/all-meal-type-recipe"
import ExploreSide from "@/components/explore/explore-side"
import HeroBanner from "@/components/explore/hero-banner"
import RecipeByCuisine from "@/components/explore/recipe-by-cuisines"

const Explore = () => {
    return (
        <>
            <HeroBanner />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="col-span-4">
                    <AllMealTypeRecipe />
                    <RecipeByCuisine />
                </div>
                <ExploreSide />
            </div>
        </>
    )
}

export default Explore