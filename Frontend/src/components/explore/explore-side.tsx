import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { TOP_CHEFS, TRENDING_TAGS } from '@/constants'

const ExploreSide = () => {
    return (
        <div className="md:mt-12 flex items-center flex-col gap-6">
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
        </div>
    )
}

export default ExploreSide