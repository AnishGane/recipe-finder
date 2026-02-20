# Pagination Feature Documentation

## Table of Contents

1. [Overview](#overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Data Flow](#data-flow)
5. [API Contract](#api-contract)
6. [Examples](#examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The pagination feature allows users to browse through large sets of recipes by breaking them into smaller, manageable pages. This improves performance, user experience, and reduces server load.

### Key Features

- ✅ Server-side pagination (MongoDB skip/limit)
- ✅ Dynamic page numbers with ellipsis
- ✅ Filter-aware (resets to page 1 on filter change)
- ✅ Efficient caching with React Query
- ✅ Smooth scroll to top on page change
- ✅ Previous/Next navigation
- ✅ Disabled states for boundary pages

---

## Backend Implementation

### Controller Logic (`recipe.controller.ts`)

```typescript
export const searchRecipes: RequestHandler = async (req, res) => {
  try {
    const {
      q, // search query
      cuisine, // cuisine filter
      mealType, // meal type filter
      difficulty, // difficulty filter
      prepTimeMax, // max prep time
      cookTimeMax, // max cook time
      tags, // tags filter
      minRating, // minimum rating
      sortBy = "newest", // sort option
      page = 1, // current page (default: 1)
      limit = 12, // items per page (default: 12)
    } = req.query;

    // 1. BUILD FILTER OBJECT
    const filter: any = { isPublished: true };

    // Text search across multiple fields
    if (q) {
      const escapedQuery = escapeRegex(q as string);
      filter.$or = [
        { title: { $regex: escapedQuery, $options: "i" } },
        { description: { $regex: escapedQuery, $options: "i" } },
        { tags: { $regex: escapedQuery, $options: "i" } },
        { "ingredients.name": { $regex: escapedQuery, $options: "i" } },
      ];
    }

    // Apply filters
    if (cuisine && cuisine !== "all") filter.cuisine = cuisine;
    if (mealType && mealType !== "all") filter.mealType = mealType;
    if (difficulty && difficulty !== "all") filter.difficulty = difficulty;

    // Numeric filters with validation
    if (prepTimeMax) {
      const val = Number(prepTimeMax);
      if (!Number.isNaN(val)) filter.prepTime = { $lte: val };
    }

    if (cookTimeMax) {
      const val = Number(cookTimeMax);
      if (!Number.isNaN(val)) filter.cookTime = { $lte: val };
    }

    if (minRating) {
      const val = Number(minRating);
      if (!Number.isNaN(val)) filter.averageRating = { $gte: val };
    }

    // Tag filtering
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // 2. SORTING LOGIC
    let sort: any = {};
    switch (sortBy) {
      case "newest":
        sort = { publishedAt: -1 };
        break;
      case "rating":
        sort = { averageRating: -1, ratingCount: -1 };
        break;
      case "popular":
        sort = { viewCount: -1 };
        break;
      case "quickest":
        sort = { cookTime: 1, prepTime: 1 };
        break;
      default:
        sort = { publishedAt: -1 };
    }

    // 3. PAGINATION CALCULATION
    // Ensure page is at least 1
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);

    // Ensure limit is between 1 and 100
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(limit as string, 10) || 12),
    );

    // Calculate how many documents to skip
    // Formula: skip = (page - 1) * limit
    // Example: Page 2 with limit 12 → skip = (2-1) * 12 = 12
    const skip = (pageNum - 1) * limitNum;

    // 4. DATABASE QUERIES
    // Run both queries in parallel for performance
    const [recipes, total] = await Promise.all([
      // Fetch recipes for current page
      Recipe.find(filter)
        .populate("userId", "name username avatar")
        .sort(sort)
        .skip(skip) // Skip previous pages
        .limit(limitNum) // Limit to page size
        .lean(), // Return plain JS objects (faster)

      // Count total matching documents
      Recipe.countDocuments(filter),
    ]);

    // 5. RESPONSE WITH PAGINATION METADATA
    res.status(200).json({
      success: true,
      recipes,
      pagination: {
        page: pageNum, // Current page
        limit: limitNum, // Items per page
        total, // Total matching items
        pages: Math.ceil(total / limitNum), // Total pages
      },
      filters: {
        q,
        cuisine,
        mealType,
        difficulty,
        prepTimeMax,
        cookTimeMax,
        tags,
        minRating,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Search recipes error:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
};
```

### Helper Function for Regex Escaping

```typescript
/**
 * Escape special regex characters in search query
 * Prevents regex injection attacks
 */
function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
```

---

## Frontend Implementation

### Component Structure

```typescript
const RecipeSearch = () => {
  // 1. STATE MANAGEMENT
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
    limit: 12,
  });

  // 2. DEBOUNCED SEARCH
  const debouncedQuery = useDebounce(filters.q, 500);
  const debouncedFilters = {
    ...filters,
    q: debouncedQuery,
    page,
  };

  // 3. DATA FETCHING WITH REACT QUERY
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedFilters, page],
    queryFn: () => searchRecipes(debouncedFilters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recipes = data?.recipes || [];
  const pagination = data?.pagination;

  // 4. PAGINATION HANDLERS
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // 5. PAGE NUMBER GENERATION
  const getPageNumbers = () => {
    if (!pagination) return [];

    const { pages } = pagination;
    const pageNumbers: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      pageNumbers.push(1); // Always show first

      if (page > 3) {
        pageNumbers.push("ellipsis");
      }

      // Show current page and neighbors
      const start = Math.max(2, page - 1);
      const end = Math.min(pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (page < pages - 2) {
        pageNumbers.push("ellipsis");
      }

      pageNumbers.push(pages); // Always show last
    }

    return pageNumbers;
  };

  // 6. RESET PAGE ON FILTER CHANGE
  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
    setPage(1); // Always reset to page 1
  };

  // ... render JSX
};
```

### API Client Function

```typescript
export const searchRecipes = async (filters: SearchFilters) => {
  const params: Record<string, string> = {};

  // Only add non-default values to reduce URL clutter
  if (filters.q) params.q = filters.q;
  if (filters.cuisine && filters.cuisine !== "all")
    params.cuisine = filters.cuisine;
  if (filters.mealType && filters.mealType !== "all")
    params.mealType = filters.mealType;
  if (filters.difficulty && filters.difficulty !== "all")
    params.difficulty = filters.difficulty;
  if (filters.prepTimeMax && filters.prepTimeMax !== 120)
    params.prepTimeMax = filters.prepTimeMax.toString();
  if (filters.cookTimeMax && filters.cookTimeMax !== 180)
    params.cookTimeMax = filters.cookTimeMax.toString();
  if (filters.minRating && filters.minRating !== 0)
    params.minRating = filters.minRating.toString();
  if (filters.sortBy) params.sortBy = filters.sortBy;

  // Pagination params - always include
  if (filters.page) params.page = filters.page.toString();
  if (filters.limit) params.limit = filters.limit.toString();

  const response = await axiosInstance.get(API_PATHS.RECIPES.SEARCH, {
    params,
  });

  return response.data;
};
```

---

## Data Flow

```
┌─────────────┐
│   User      │
│  Clicks     │
│  Page 2     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  handlePageChange   │
│  - setPage(2)       │
│  - scroll to top    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  React Query        │
│  - queryKey changes │
│  - triggers refetch │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  searchRecipes()    │
│  - builds params    │
│  - makes API call   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Backend Controller │
│  1. Parse params    │
│  2. Build filter    │
│  3. Calculate skip  │
│  4. Query DB        │
│  5. Count total     │
│  6. Return data     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Frontend Receives  │
│  {                  │
│    recipes: [...],  │
│    pagination: {    │
│      page: 2,       │
│      limit: 12,     │
│      total: 48,     │
│      pages: 4       │
│    }                │
│  }                  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Component Updates  │
│  - Display recipes  │
│  - Show page 2/4    │
│  - Update buttons   │
└─────────────────────┘
```

---

## API Contract

### Request

```http
GET /api/recipes/search?page=2&limit=12&cuisine=italian&sortBy=rating
```

### Query Parameters

| Parameter   | Type   | Default  | Description               |
| ----------- | ------ | -------- | ------------------------- |
| q           | string | ""       | Search query              |
| cuisine     | string | "all"    | Cuisine filter            |
| mealType    | string | "all"    | Meal type filter          |
| difficulty  | string | "all"    | Difficulty filter         |
| prepTimeMax | number | -        | Max prep time in minutes  |
| cookTimeMax | number | -        | Max cook time in minutes  |
| minRating   | number | -        | Minimum average rating    |
| sortBy      | string | "newest" | Sort option               |
| **page**    | number | 1        | Current page number       |
| **limit**   | number | 12       | Items per page (max: 100) |

### Response

```json
{
  "success": true,
  "recipes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Spaghetti Carbonara",
      "slug": "spaghetti-carbonara",
      "description": "Classic Italian pasta...",
      "heroImage": "https://...",
      "prepTime": 10,
      "cookTime": 20,
      "servings": 4,
      "difficulty": "easy",
      "cuisine": "italian",
      "mealType": "dinner",
      "tags": ["pasta", "italian"],
      "averageRating": 4.5,
      "ratingCount": 23,
      "viewCount": 156,
      "userId": {
        "_id": "...",
        "name": "Chef Mario",
        "username": "mario_chef",
        "avatar": "https://..."
      }
    }
    // ... 11 more recipes
  ],
  "pagination": {
    "page": 2, // Current page
    "limit": 12, // Items per page
    "total": 48, // Total matching recipes
    "pages": 4 // Total pages (48 / 12 = 4)
  },
  "filters": {
    "q": "",
    "cuisine": "italian",
    "mealType": "all",
    "difficulty": "all",
    "sortBy": "rating"
  }
}
```

---

## Examples

### Example 1: Basic Pagination

**Scenario:** Browse all recipes, 12 per page

```typescript
// Page 1
GET /api/recipes/search?page=1&limit=12
// Returns recipes 1-12

// Page 2
GET /api/recipes/search?page=2&limit=12
// Returns recipes 13-24 (skip = 12)

// Page 3
GET /api/recipes/search?page=3&limit=12
// Returns recipes 25-36 (skip = 24)
```

### Example 2: Filtered Pagination

**Scenario:** Italian recipes, sorted by rating

```typescript
// Total: 48 Italian recipes
// Pages: 4 (48 / 12 = 4)

// Page 1
GET /api/recipes/search?page=1&limit=12&cuisine=italian&sortBy=rating
// Returns top 12 Italian recipes

// Page 2
GET /api/recipes/search?page=2&limit=12&cuisine=italian&sortBy=rating
// Returns next 12 Italian recipes
```

### Example 3: Search with Pagination

**Scenario:** Search "pasta", filter by cuisine

```typescript
// User types "pasta"
// → Debounced after 500ms
// → Reset to page 1

GET /api/recipes/search?q=pasta&page=1&limit=12

// User changes cuisine to "italian"
// → Reset to page 1

GET /api/recipes/search?q=pasta&cuisine=italian&page=1&limit=12

// User clicks page 2

GET /api/recipes/search?q=pasta&cuisine=italian&page=2&limit=12
```

### Example 4: Edge Cases

```typescript
// Invalid page (too low)
GET /api/recipes/search?page=0&limit=12
// Backend: Math.max(1, 0) = 1 → Returns page 1

// Invalid page (too high)
GET /api/recipes/search?page=999&limit=12
// Backend: Returns empty array, pagination shows pages: 4

// Invalid limit (too high)
GET /api/recipes/search?page=1&limit=500
// Backend: Math.min(100, 500) = 100 → Limits to 100

// Invalid limit (too low)
GET /api/recipes/search?page=1&limit=-5
// Backend: Math.max(1, -5) = 1 → Uses 1
```

---

## Best Practices

### Backend

1. **Always validate and sanitize inputs**

   ```typescript
   const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
   const limitNum = Math.min(
     100,
     Math.max(1, parseInt(limit as string, 10) || 12),
   );
   ```

2. **Use parallel queries for performance**

   ```typescript
   const [recipes, total] = await Promise.all([
     Recipe.find(filter).skip(skip).limit(limitNum),
     Recipe.countDocuments(filter),
   ]);
   ```

3. **Add indexes for sorting fields**

   ```typescript
   recipeSchema.index({ publishedAt: -1 });
   recipeSchema.index({ averageRating: -1 });
   recipeSchema.index({ viewCount: -1 });
   ```

4. **Use `.lean()` for read-only queries**

   ```typescript
   Recipe.find(filter).lean(); // Returns plain JS objects
   ```

5. **Limit maximum page size**
   ```typescript
   const limitNum = Math.min(100, limit); // Max 100 items per page
   ```

### Frontend

1. **Reset to page 1 on filter changes**

   ```typescript
   const handleFilterChange = (key, value) => {
     setFilters({ ...filters, [key]: value });
     setPage(1); // Always reset
   };
   ```

2. **Scroll to top on page change**

   ```typescript
   window.scrollTo({ top: 0, behavior: "smooth" });
   ```

3. **Disable navigation at boundaries**

   ```typescript
   <PaginationPrevious
     className={page === 1 ? "pointer-events-none opacity-50" : ""}
   />
   ```

4. **Include page in React Query key**

   ```typescript
   queryKey: ["search", debouncedFilters, page];
   ```

5. **Show loading state during pagination**
   ```typescript
   {isLoading && <Loader2 className="animate-spin" />}
   ```

---

## Troubleshooting

### Problem: Pagination shows wrong page count

**Cause:** Total count not matching actual results

**Solution:** Ensure filter in `countDocuments` matches filter in `find`

```typescript
// ❌ Wrong - different filters
const recipes = await Recipe.find({ isPublished: true, cuisine: "italian" });
const total = await Recipe.countDocuments({ isPublished: true }); // Missing cuisine filter

// ✅ Correct - same filter
const filter = { isPublished: true, cuisine: "italian" };
const recipes = await Recipe.find(filter);
const total = await Recipe.countDocuments(filter);
```

### Problem: Duplicate results across pages

**Cause:** No consistent sorting

**Solution:** Always add a unique field to sort (like `_id`)

```typescript
// ❌ Wrong - unstable sort
sort = { averageRating: -1 };

// ✅ Correct - stable sort
sort = { averageRating: -1, _id: -1 };
```

### Problem: Page doesn't reset on search

**Cause:** Forgot to reset page state

**Solution:** Always reset page when filters change

```typescript
const handleSearch = (query) => {
  setFilters({ ...filters, q: query });
  setPage(1); // Don't forget this!
};
```

### Problem: Slow pagination performance

**Cause:** Large skip values or missing indexes

**Solutions:**

1. Add database indexes

   ```typescript
   recipeSchema.index({ publishedAt: -1 });
   ```

2. Use cursor-based pagination for very large datasets

   ```typescript
   // Instead of skip/limit
   Recipe.find({ _id: { $gt: lastId } }).limit(12);
   ```

3. Consider caching frequently accessed pages

### Problem: React Query not refetching

**Cause:** Query key doesn't include page

**Solution:** Include page in query key

```typescript
// ❌ Wrong
queryKey: ["search", filters];

// ✅ Correct
queryKey: ["search", filters, page];
```

---

## Performance Metrics

### Expected Performance

| Records | Page Size | Skip   | Query Time |
| ------- | --------- | ------ | ---------- |
| 100     | 12        | 0      | ~5ms       |
| 1,000   | 12        | 120    | ~10ms      |
| 10,000  | 12        | 1,200  | ~50ms      |
| 100,000 | 12        | 12,000 | ~200ms     |

### Optimization Tips

1. **Add compound indexes for common queries**

   ```typescript
   recipeSchema.index({ isPublished: 1, publishedAt: -1 });
   recipeSchema.index({ cuisine: 1, averageRating: -1 });
   ```

2. **Use `lean()` to reduce memory**

   ```typescript
   Recipe.find(filter).lean(); // 30% faster
   ```

3. **Limit populated fields**

   ```typescript
   .populate("userId", "name username avatar") // Only needed fields
   ```

4. **Consider cursor pagination for infinite scroll**
   ```typescript
   Recipe.find({ _id: { $gt: cursor } }).limit(12);
   ```

---

## Summary

✅ **Pagination breaks large datasets into pages**
✅ **Backend uses `skip` and `limit` for MongoDB**
✅ **Frontend uses React Query for caching**
✅ **Always reset to page 1 on filter changes**
✅ **Include pagination metadata in responses**
✅ **Validate and sanitize all inputs**
✅ **Add proper database indexes for performance**

---

**Created:** 2026-02-21  
**Version:** 1.0  
**Author:** Flavorly
