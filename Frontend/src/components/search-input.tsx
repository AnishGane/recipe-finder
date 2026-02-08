import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const SearchInput = () => {
    return (
        <div className="w-full max-w-2xl mx-auto mt-4 relative">
            <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-foreground/60" />
            <Input placeholder="What are you cooking today?" className="pl-10 pr-24 py-6 bg-white text-muted-foreground placeholder:text-foreground/60 text-sm md:text-base rounded-xl placeholder:text-sm" />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg" variant={"secondary"}>Search</Button>
        </div>
    )
}

export default SearchInput