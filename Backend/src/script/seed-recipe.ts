import mongoose from "mongoose";
import User from "../models/User.model";
import dotenv from "dotenv";
import { generateSlug } from "../utils/helper";
import Recipe from "../models/Recipe.model";

dotenv.config();

const recipesData = [
  {
    title: "Classic Spaghetti Carbonara",
    description:
      "A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper. Simple yet incredibly delicious.",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    cuisine: "italian",
    tags: ["pasta", "dinner", "italian", "quick"],
    ingredients: [
      { name: "Spaghetti", quantity: 400, unit: "g", notes: "" },
      { name: "Pancetta", quantity: 200, unit: "g", notes: "diced" },
      { name: "Eggs", quantity: 4, unit: "whole", notes: "large" },
      { name: "Parmesan cheese", quantity: 100, unit: "g", notes: "grated" },
      { name: "Black pepper", quantity: 1, unit: "tsp", notes: "freshly ground" },
      { name: "Salt", quantity: 1, unit: "tsp", notes: "to taste" },
    ],
    instructions: [
      {
        step: 1,
        description: "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
        duration: 10,
      },
      {
        step: 2,
        description: "While pasta cooks, fry pancetta in a large pan until crispy.",
        duration: 5,
      },
      {
        step: 3,
        description: "In a bowl, whisk together eggs, parmesan, and black pepper.",
        duration: 2,
      },
      {
        step: 4,
        description: "Drain pasta, reserving 1 cup of pasta water. Add pasta to pancetta pan.",
        duration: 1,
      },
      {
        step: 5,
        description: "Remove from heat and quickly stir in egg mixture, adding pasta water to create a creamy sauce.",
        duration: 2,
      },
    ],
  },
  {
    title: "Chicken Tikka Masala",
    description:
      "Tender chicken pieces in a creamy, spiced tomato sauce. A beloved Indian dish perfect with naan or rice.",
    prepTime: 30,
    cookTime: 40,
    servings: 6,
    difficulty: "medium",
    cuisine: "indian",
    tags: ["chicken", "dinner", "indian", "curry"],
    ingredients: [
      { name: "Chicken breast", quantity: 800, unit: "g", notes: "cubed" },
      { name: "Yogurt", quantity: 200, unit: "ml", notes: "plain" },
      { name: "Tomato sauce", quantity: 400, unit: "ml", notes: "" },
      { name: "Heavy cream", quantity: 200, unit: "ml", notes: "" },
      { name: "Garam masala", quantity: 2, unit: "tbsp", notes: "" },
      { name: "Turmeric", quantity: 1, unit: "tsp", notes: "" },
      { name: "Cumin", quantity: 2, unit: "tsp", notes: "" },
      { name: "Garlic", quantity: 4, unit: "cloves", notes: "minced" },
      { name: "Ginger", quantity: 2, unit: "tbsp", notes: "grated" },
      { name: "Onion", quantity: 2, unit: "whole", notes: "diced" },
    ],
    instructions: [
      {
        step: 1,
        description: "Marinate chicken in yogurt, garam masala, turmeric, and cumin for at least 30 minutes.",
        duration: 30,
      },
      {
        step: 2,
        description: "Grill or pan-fry marinated chicken until cooked through.",
        duration: 15,
      },
      {
        step: 3,
        description: "In a large pan, sauté onions, garlic, and ginger until golden.",
        duration: 8,
      },
      {
        step: 4,
        description: "Add tomato sauce and remaining spices. Simmer for 10 minutes.",
        duration: 10,
      },
      {
        step: 5,
        description: "Stir in cream and cooked chicken. Simmer for 7 more minutes.",
        duration: 7,
      },
    ],
  },
  {
    title: "Chocolate Chip Cookies",
    description:
      "Classic homemade chocolate chip cookies that are crispy on the edges and chewy in the center.",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "easy",
    cuisine: "american",
    tags: ["desserts", "baking", "cookies", "chocolate"],
    ingredients: [
      { name: "All-purpose flour", quantity: 280, unit: "g", notes: "" },
      { name: "Butter", quantity: 225, unit: "g", notes: "softened" },
      { name: "Brown sugar", quantity: 200, unit: "g", notes: "packed" },
      { name: "White sugar", quantity: 100, unit: "g", notes: "" },
      { name: "Eggs", quantity: 2, unit: "whole", notes: "large" },
      { name: "Vanilla extract", quantity: 2, unit: "tsp", notes: "" },
      { name: "Baking soda", quantity: 1, unit: "tsp", notes: "" },
      { name: "Salt", quantity: 1, unit: "tsp", notes: "" },
      { name: "Chocolate chips", quantity: 350, unit: "g", notes: "" },
    ],
    instructions: [
      {
        step: 1,
        description: "Preheat oven to 375°F (190°C).",
        duration: 1,
      },
      {
        step: 2,
        description: "Cream together butter and both sugars until fluffy.",
        duration: 3,
      },
      {
        step: 3,
        description: "Beat in eggs and vanilla extract.",
        duration: 2,
      },
      {
        step: 4,
        description: "In a separate bowl, whisk together flour, baking soda, and salt.",
        duration: 2,
      },
      {
        step: 5,
        description: "Gradually mix dry ingredients into wet ingredients. Fold in chocolate chips.",
        duration: 3,
      },
      {
        step: 6,
        description: "Drop spoonfuls of dough onto baking sheets. Bake for 10-12 minutes.",
        duration: 12,
      },
    ],
  },
  {
    title: "Avocado Toast with Poached Egg",
    description:
      "A healthy and delicious breakfast featuring creamy avocado on sourdough topped with a perfectly poached egg.",
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    cuisine: "american",
    tags: ["breakfast", "healthy", "quick", "vegetarian"],
    ingredients: [
      { name: "Sourdough bread", quantity: 2, unit: "slices", notes: "thick-cut" },
      { name: "Avocado", quantity: 1, unit: "whole", notes: "ripe" },
      { name: "Eggs", quantity: 2, unit: "whole", notes: "" },
      { name: "Lemon juice", quantity: 1, unit: "tsp", notes: "" },
      { name: "Red pepper flakes", quantity: 0.5, unit: "tsp", notes: "" },
      { name: "Salt", quantity: 0.5, unit: "tsp", notes: "to taste" },
      { name: "Black pepper", quantity: 0.5, unit: "tsp", notes: "to taste" },
    ],
    instructions: [
      {
        step: 1,
        description: "Toast bread slices until golden and crispy.",
        duration: 3,
      },
      {
        step: 2,
        description: "Mash avocado with lemon juice, salt, and pepper.",
        duration: 2,
      },
      {
        step: 3,
        description: "Bring a pot of water to a gentle simmer. Add a splash of vinegar.",
        duration: 3,
      },
      {
        step: 4,
        description: "Crack eggs into water and poach for 3-4 minutes.",
        duration: 4,
      },
      {
        step: 5,
        description: "Spread avocado on toast, top with poached egg, and sprinkle with red pepper flakes.",
        duration: 1,
      },
    ],
  },
  {
    title: "Quinoa Buddha Bowl",
    description:
      "A colorful, nutrient-packed vegan bowl with quinoa, roasted vegetables, chickpeas, and tahini dressing.",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "easy",
    cuisine: "mediterranean",
    tags: ["lunch", "vegan", "healthy", "bowl", "gluten-free"],
    ingredients: [
      { name: "Quinoa", quantity: 200, unit: "g", notes: "uncooked" },
      { name: "Chickpeas", quantity: 400, unit: "g", notes: "canned, drained" },
      { name: "Sweet potato", quantity: 2, unit: "whole", notes: "cubed" },
      { name: "Kale", quantity: 100, unit: "g", notes: "chopped" },
      { name: "Cherry tomatoes", quantity: 200, unit: "g", notes: "halved" },
      { name: "Tahini", quantity: 60, unit: "ml", notes: "" },
      { name: "Lemon juice", quantity: 2, unit: "tbsp", notes: "" },
      { name: "Olive oil", quantity: 3, unit: "tbsp", notes: "" },
      { name: "Garlic", quantity: 2, unit: "cloves", notes: "minced" },
    ],
    instructions: [
      {
        step: 1,
        description: "Preheat oven to 400°F (200°C). Cook quinoa according to package directions.",
        duration: 15,
      },
      {
        step: 2,
        description: "Toss sweet potato and chickpeas with olive oil, salt, and pepper. Roast for 25 minutes.",
        duration: 25,
      },
      {
        step: 3,
        description: "Massage kale with a bit of olive oil and lemon juice.",
        duration: 2,
      },
      {
        step: 4,
        description: "Make tahini dressing by whisking tahini, lemon juice, garlic, and water.",
        duration: 3,
      },
      {
        step: 5,
        description: "Assemble bowls with quinoa, roasted vegetables, chickpeas, kale, and tomatoes. Drizzle with dressing.",
        duration: 5,
      },
    ],
  },
  {
    title: "Beef Tacos",
    description:
      "Flavorful ground beef tacos with fresh toppings. Perfect for a quick weeknight dinner or casual gathering.",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: "easy",
    cuisine: "mexican",
    tags: ["dinner", "mexican", "quick", "tacos"],
    ingredients: [
      { name: "Ground beef", quantity: 500, unit: "g", notes: "" },
      { name: "Taco seasoning", quantity: 2, unit: "tbsp", notes: "" },
      { name: "Taco shells", quantity: 8, unit: "whole", notes: "" },
      { name: "Lettuce", quantity: 100, unit: "g", notes: "shredded" },
      { name: "Tomato", quantity: 2, unit: "whole", notes: "diced" },
      { name: "Cheddar cheese", quantity: 100, unit: "g", notes: "shredded" },
      { name: "Sour cream", quantity: 100, unit: "ml", notes: "" },
      { name: "Salsa", quantity: 100, unit: "ml", notes: "" },
    ],
    instructions: [
      {
        step: 1,
        description: "Brown ground beef in a large skillet over medium-high heat.",
        duration: 7,
      },
      {
        step: 2,
        description: "Drain excess fat and add taco seasoning with 1/4 cup water. Simmer for 5 minutes.",
        duration: 5,
      },
      {
        step: 3,
        description: "Warm taco shells according to package directions.",
        duration: 3,
      },
      {
        step: 4,
        description: "Fill shells with beef and top with lettuce, tomato, cheese, sour cream, and salsa.",
        duration: 5,
      },
    ],
  },
];

const seedRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");

    // Get a user to assign recipes to (use first user or create one)
    let user = await User.findOne();
    
    if (!user) {
      console.log("No users found. Please create a user first.");
      process.exit(1);
    }

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log("Cleared existing recipes");

    // Create recipes with unique slugs
    const recipes = recipesData.map((recipe) => ({
      ...recipe,
      userId: user?._id,
      slug: generateSlug(recipe.title),
      isPublished: true,
      publishedAt: new Date(),
    }));

    await Recipe.insertMany(recipes);
    console.log(`✅ Seeded ${recipes.length} recipes successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

// Run the seed function
seedRecipes();