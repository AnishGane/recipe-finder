import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Tabsrecipe = () => {
    return (
        <div className="my-10">
            <div className=" pb-2.5 border-b border-border/20">
                <Tabs defaultValue="allrecipe">
                    <TabsList className="gap-3" variant="line">
                        <TabsTrigger value="allrecipe">All Recipes</TabsTrigger>
                        <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                        <TabsTrigger value="lunch">Lunch</TabsTrigger>
                        <TabsTrigger value="dinner">Dinner</TabsTrigger>
                        <TabsTrigger value="desserts">Desserts</TabsTrigger>
                        <TabsTrigger value="vegan">Vegan</TabsTrigger>
                        <TabsTrigger value="gluten-free">Gluten-Free</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}

export default Tabsrecipe