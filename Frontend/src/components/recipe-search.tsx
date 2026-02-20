import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { searchRecipes, getCuisineList, getMealTypeList } from "@/api/api";
import RecipeCard from "@/components/recipe-card";
import { Loader2 } from "lucide-react";
import type { SearchFilters, Recipe } from "@/types/recipe.type";
import { Card } from "./ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";

const RecipeSearch = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<SearchFilters>({
        q: "",
        cuisine: "all",
        mealType: "all",
        difficulty: "all",
        prepTimeMax: 120,
        cookTimeMax: 180,
        minRating: 0,
        sortBy: "newest",
        page: 1,
        limit: 12
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Debounce search query to avoid too many API calls
    const debouncedQuery = useDebounce(filters.q, 500);

    // Create debounced filters object
    const debouncedFilters = {
        ...filters,
        q: debouncedQuery, // Use debounced query instead of immediate value
        page, // Include the current page
    };

    const hasActiveFilters = () => {
        return (
            debouncedQuery !== "" ||
            filters.cuisine !== "all" ||
            filters.mealType !== "all" ||
            filters.difficulty !== "all" ||
            filters.prepTimeMax !== 120 ||
            filters.cookTimeMax !== 180 ||
            filters.minRating !== 0
        );
    };

    // Fetch cuisines and meal types for filter options
    const { data: cuisinesData } = useQuery({
        queryKey: ["cuisines"],
        queryFn: getCuisineList,
        staleTime: 1000 * 60 * 10,
    });

    const { data: mealTypesData } = useQuery({
        queryKey: ["mealTypes"],
        queryFn: getMealTypeList,
        staleTime: 1000 * 60 * 10,
    });

    // Search recipes with filters - Use debounced filters
    const { data, isLoading, error } = useQuery({
        queryKey: ["search", debouncedFilters, page], // Use entire debounced filters object
        queryFn: () => searchRecipes(debouncedFilters),
        staleTime: 1000 * 60 * 5,
    });

    const cuisines = cuisinesData?.cuisines || [];
    const mealTypes = mealTypesData?.mealTypes || [];
    const recipes = data?.recipes || [];
    const pagination = data?.pagination;

    const clearFilters = () => {
        setFilters({
            q: "",
            cuisine: "all",
            mealType: "all",
            difficulty: "all",
            prepTimeMax: 120,
            cookTimeMax: 180,
            minRating: 0,
            sortBy: "newest",
            page: 1,
            limit: 12
        });
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            handlePageChange(page - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination && page < pagination.pages) {
            handlePageChange(page + 1);
        }
    };

    // Generate Page number to be displayed dynamically
    const getPageNumbers = () => {
        if (!pagination) return [];

        const { pages } = pagination;
        const pageNumbers: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (pages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= pages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            if (page > 3) {
                pageNumbers.push('ellipsis');
            }

            // Show pages around current page
            const start = Math.max(2, page - 1);
            const end = Math.min(pages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (page < pages - 2) {
                pageNumbers.push('ellipsis');
            }

            // Always show last page
            if (pages > 1) {
                pageNumbers.push(pages);
            }
        }
        return pageNumbers;
    }

    const activeFilterCount = () => {
        let count = 0;
        if (filters.cuisine !== "all") count++;
        if (filters.mealType !== "all") count++;
        if (filters.difficulty !== "all") count++;
        if (filters.prepTimeMax !== 120) count++;
        if (filters.cookTimeMax !== 180) count++;
        if (filters.minRating !== 0) count++;
        return count;
    };

    return (
        <div className=" my-8">
            {/* Search Bar */}
            <Card className=" p-2 mb-6 ring border-none ring-ring/10">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search recipes, ingredients, cuisines..."
                            value={filters.q}
                            autoFocus
                            onChange={(e) => {
                                setFilters({ ...filters, q: e.target.value });
                                setPage(1) // reset page to 1 on search
                            }}
                            className="rounded-md pl-10 pr-10 outline-none border-none placeholder:text-foreground/60 "
                        />
                        {filters.q && (
                            <button
                                onClick={() => {
                                    setFilters({ ...filters, q: "" });
                                    setPage(1)
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-4" />
                                <span className="sr-only">Clear search</span>
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="relative cursor-pointer hover:text-white hover:bg-accent!">
                                <SlidersHorizontal className="size-4" />
                                Filters
                                {activeFilterCount() > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className=" size-5 rounded-full p-0 flex items-center justify-center"
                                    >
                                        {activeFilterCount()}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle className=" font-sn-pro text-foreground text-xl">Filter Recipes</SheetTitle>
                                <SheetDescription className="text-muted-foreground text-xs">
                                    Refine your search with these filters
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6 mt-6 px-4">
                                {/* Sort By */}
                                <div className="space-y-2 text-foreground">
                                    <Label>Sort By</Label>
                                    <Select
                                        value={filters.sortBy}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, sortBy: value });
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="border-none cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                            <SelectItem value="quickest">Quickest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Cuisine */}
                                <div className="space-y-2 text-foreground">
                                    <Label>Cuisine</Label>
                                    <Select
                                        value={filters.cuisine}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, cuisine: value });
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="border-none cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Cuisines</SelectItem>
                                            {cuisines.map((cuisine: string) => (
                                                <SelectItem key={cuisine} value={cuisine} className="capitalize">
                                                    {cuisine}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Meal Type */}
                                <div className="space-y-2 text-foreground">
                                    <Label>Meal Type</Label>
                                    <Select
                                        value={filters.mealType}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, mealType: value });
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="border-none cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Meal Types</SelectItem>
                                            {mealTypes.map((mealType: string) => (
                                                <SelectItem key={mealType} value={mealType} className="capitalize">
                                                    {mealType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Difficulty */}
                                <div className="space-y-2 text-foreground">
                                    <Label>Difficulty</Label>
                                    <Select
                                        value={filters.difficulty}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, difficulty: value });
                                            setPage(1);
                                        }}
                                    >
                                        <SelectTrigger className="border-none cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Any Difficulty</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Prep Time */}
                                <div className="space-y-2 text-foreground">
                                    <Label>
                                        Max Prep Time: {filters.prepTimeMax} min
                                    </Label>
                                    <Slider
                                        value={[filters.prepTimeMax ?? 120]}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, prepTimeMax: value[0] });
                                            setPage(1);
                                        }}
                                        max={120}
                                        step={5}
                                    />
                                </div>

                                {/* Cook Time */}
                                <div className="space-y-2 text-foreground">
                                    <Label>
                                        Max Cook Time: {filters.cookTimeMax} min
                                    </Label>
                                    <Slider
                                        value={[filters.cookTimeMax ?? 180]}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, cookTimeMax: value[0] });
                                            setPage(1);
                                        }}
                                        max={180}
                                        step={5}
                                    />
                                </div>

                                {/* Minimum Rating */}
                                <div className="space-y-2 text-foreground">
                                    <Label>Minimum Rating: {filters.minRating || 0}★</Label>
                                    <Slider
                                        value={[filters.minRating || 0]}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, minRating: value[0] });
                                            setPage(1);
                                        }}
                                        max={5}
                                        step={0.5}
                                    />
                                </div>

                                {/* Clear Filters */}
                                {(hasActiveFilters() || activeFilterCount() > 0) && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="w-full text-foreground cursor-pointer py-5"
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </Card >

            {/* Active Filters Display */}
            {
                (debouncedQuery || activeFilterCount() > 0) && (
                    <div className="flex flex-wrap gap-2 mb-6 items-center">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {debouncedQuery && (
                            <Badge variant="secondary">
                                Search: "{debouncedQuery}"
                                <button
                                    onClick={() => {
                                        setFilters({ ...filters, q: "" });
                                        setPage(1);
                                    }}
                                    className="ml-1"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        )}                        {filters.cuisine !== "all" && (
                            <Badge variant="secondary" className="capitalize">
                                {filters.cuisine}
                                <button
                                    onClick={() => {
                                        setFilters({ ...filters, cuisine: "all" });
                                        setPage(1);
                                    }}
                                    className="ml-1"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.mealType !== "all" && (
                            <Badge variant="secondary" className="capitalize">
                                {filters.mealType}
                                <button
                                    onClick={() => { setFilters({ ...filters, mealType: "all" }); setPage(1); }}
                                    className="ml-1"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        )}
                        {filters.difficulty !== "all" && (
                            <Badge variant="secondary" className="capitalize">
                                {filters.difficulty}
                                <button
                                    onClick={() => { setFilters({ ...filters, difficulty: "all" }); setPage(1); }}
                                    className="ml-1"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        )}
                    </div>
                )
            }

            {/* Results */}
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-destructive">Failed to load recipes</p>
                    </div>
                ) : recipes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-muted-foreground">No recipes found</p>
                        <p className="text-sm mt-2">
                            {hasActiveFilters()
                                ? "Try adjusting your search or filters"
                                : "Be the first to add a recipe!"
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground">
                                {hasActiveFilters()
                                    ? `Found ${data?.pagination?.total || 0} recipes`
                                    : `Showing all ${data?.pagination?.total || 0} recipes`
                                }
                            </p>
                        </div>
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {recipes.map((recipe: Recipe) => (
                                    <RecipeCard key={recipe._id} recipe={recipe} />
                                ))}
                            </div>
                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={handlePreviousPage}
                                                className={cn("text-foreground", page === 1 ? "pointer-events-none opacity-50 text-foreground" : "cursor-pointer")}
                                            />
                                        </PaginationItem>

                                        {getPageNumbers().map((pageNum, index) => (
                                            <PaginationItem key={index}>
                                                {pageNum === 'ellipsis' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(pageNum)}
                                                        isActive={page === pageNum}
                                                        className="cursor-pointer border-border/40 hover:bg-muted/90"
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={handleNextPage}
                                                className={cn("text-foreground", page === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer")}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default RecipeSearch;