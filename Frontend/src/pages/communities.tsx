import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

const Communities = () => {
    return (
        <section>
            <div className="gap-6">
                {/* Collection with cards, filters and heading */}
                <div className="">
                    <h1 className="text-heading font-sn-pro font-semibold tracking-tight text-foreground">Discover Communities</h1>
                    <p className="text-muted-foreground text-sm max-w-lg">See the recipes posted by all the chefs & people from all over the world in the community page.</p>

                    {/* Seach & Filter */}
                    <Card className="my-6 border-none ring-ring/30 ring p-1.5">
                        <CardContent className="p-0">
                            <div className="flex justify-between gap-12">
                                {/* Input */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-foreground/60" />
                                    <Input placeholder="Search for a recipe here" className="pl-10 py-6 bg-background text-muted-foreground placeholder:text-foreground/60 border-none text-sm md:text-base rounded-lg placeholder:text-sm" />
                                </div>
                                {/* Filter */}
                                <div className="flex items-center justify-between gap-4 pr-1">
                                    <Select>
                                        <SelectTrigger className="w-full border-none ring-1 ring-neutral-200">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select>
                                        <SelectTrigger className="w-full border-none ring-1 ring-neutral-200">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Select>
                                        <SelectTrigger className="w-full border-none ring-1 ring-neutral-200">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Right Side with trending tags and banner */}
                <div>banner</div>
            </div>
        </section>
    )
}

export default Communities