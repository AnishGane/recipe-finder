import RecipeSearch from "@/components/recipe-search"

const Communities = () => {
    return (
        <section>
            <div className="gap-6">
                {/* Collection with cards, filters and heading */}
                <div className="">
                    <h1 className="text-heading font-sn-pro font-semibold tracking-tight text-foreground">Discover Communities</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">See the recipes posted by all the chefs & people from all over the world in the community page.</p>

                    <RecipeSearch />
                </div>
            </div>
        </section>
    )
}

export default Communities