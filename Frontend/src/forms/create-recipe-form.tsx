import { BsCameraFill } from "react-icons/bs";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Plus, Image, Check, Clock, ChefHat, Trash2Icon, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFieldArray } from "react-hook-form";


// Constants
const CUISINES = [
    "Italian",
    "Chinese",
    "Indian",
    "Mexican",
    "Japanese",
    "French",
    "Thai",
    "Greek",
    "American",
    "Mediterranean",
    "Other",
] as const;

const MEAL_TYPES = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert'
] as const;

const DIFFICULTY_LEVELS = [
    'Easy',
    'Medium',
    'Hard'
] as const;

// Zod Schema
const ingredientSchema = z.object({
    qty: z.string().min(1, "Quantity is required"),
    unit: z.string().min(1, "Unit is required"),
    name: z.string().min(1, "Ingredient name is required"),
});

const instructionSchema = z.object({
    step: z.number(),
    description: z.string().min(10, "Instruction must be at least 10 characters"),
    image: z.string().nullable(),
    duration: z.number(),
});

const recipeFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description is too long"),
    prepTime: z.string().min(1, "Prep time is required"),
    cookTime: z.string().min(1, "Cook time is required"),
    difficulty: z.enum(DIFFICULTY_LEVELS),
    servings: z.string().min(1, "Servings is required"),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    instructions: z.array(instructionSchema).min(1, "At least one instruction is required"),
    cuisines: z.array(z.string()),
    mealTypes: z.array(z.string()),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

const CreateRecipeForm = () => {
    const [heroImage, setHeroImage] = useState<string | null>(null);

    const form = useForm<RecipeFormValues>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
            title: '',
            description: '',
            prepTime: '',
            cookTime: '',
            difficulty: 'Easy',
            servings: '',
            ingredients: [
                { qty: '1', unit: 'cup', name: 'Whole milk' },
                { qty: '500', unit: 'g', name: 'All-purpose flour' }
            ],
            instructions: [
                { step: 1, description: '', image: null, duration: 5 },
                { step: 2, description: '', image: null, duration: 10 }
            ],
            cuisines: ['Italian'],
            mealTypes: ['Dinner']
        },
    });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredientField } = useFieldArray({
        control: form.control,
        name: "ingredients",
    });

    const { fields: instructionFields, append: appendInstruction, remove: removeInstructionField } = useFieldArray({
        control: form.control,
        name: "instructions",
    });

    const instructions = form.watch('instructions');

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (heroImage) {
                URL.revokeObjectURL(heroImage);
            }
            const objectUrl = URL.createObjectURL(file);
            setHeroImage(objectUrl);
        }
    };

    const addIngredient = () => {
        appendIngredient({ qty: '', unit: '', name: '' });
    };

    const removeIngredient = (index: number) => {
        if (form.getValues('ingredients').length > 1) {
            removeIngredientField(index);
        }
    };

    const addInstruction = () => {
        const currentInstructions = form.getValues('instructions');
        appendInstruction({
            step: currentInstructions.length + 1,
            description: '',
            image: null,
            duration: 0,
        });
    };

    const removeInstruction = (index: number) => {
        if (instructions.length > 1) {
            removeInstructionField(index);
        }
    };

    const toggleTag = (category: 'cuisines' | 'mealTypes', tag: string) => {
        const current = form.getValues(category);

        if (current.includes(tag)) {
            form.setValue(category, current.filter(t => t !== tag));
        } else {
            form.setValue(category, [...current, tag]);
        }
    };

    const onSubmit = (data: RecipeFormValues) => {
        console.log('Form Data:', data);
        console.log('Hero Image:', heroImage);
        // Handle form submission
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Hero Image Upload */}
                    <Card className={cn("rounded-2xl border-2 p-12 border-dashed border-border/10 mb-6 text-center", heroImage && "p-0 border-none")}>
                        {!heroImage ? (
                            <>
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-center">
                                        <BsCameraFill className="size-10 text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground my-2">Upload Hero Image</h3>
                                    <p className="text-sm text-muted-foreground mb-1 max-w-xl mx-auto">
                                        Drag and drop your main dish photo here (recommended 16:9 ratio, min 1200x675px)
                                    </p>
                                </div>
                                <label className="inline-block">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <span className="px-6 py-2.5 bg-secondary rounded-lg text-muted font-medium cursor-pointer transition-colors inline-block text-sm hover:bg-muted/80">
                                        Select Photo
                                    </span>
                                </label>
                            </>
                        ) : (
                            <div className="relative">
                                <img src={heroImage} alt="Hero" className="w-full h-full object-cover rounded-lg" />
                                <Button
                                    type="button"
                                    onClick={() => setHeroImage(null)}
                                    className="absolute top-4 right-4 bg-destructive/85 hover:bg-destructive rounded-lg cursor-pointer"
                                >
                                    <Trash2Icon className="size-5" />
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Recipe Basics */}
                    <Card className="rounded-xl border-none ring ring-ring/30 p-6 mb-6">
                        <h2 className="text-subheading font-semibold text-foreground mb-1">Recipe Basics</h2>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Recipe Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Grandma's Famous Lasagna"
                                                className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share the story behind your recipe..."
                                                rows={4}
                                                className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring focus-visible:ring-secondary/70 focus-within:border-none resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="prepTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Prep Time (mins)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="15"
                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none no-spinner"
                                                        {...field}
                                                    />
                                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cookTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cook Time (mins)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="45"
                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none no-spinner"
                                                        {...field}
                                                    />
                                                    <ChefHat className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Difficulty</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none">
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {DIFFICULTY_LEVELS.map(level => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="servings"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Servings</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="4"
                                                    className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none no-spinner"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Ingredients */}
                    <Card className="rounded-xl border-none ring ring-ring/30 p-6 mb-6">
                        <div className="mb-4">
                            <h2 className="text-subheading font-semibold text-foreground">Ingredients</h2>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-3 text-para font-medium text-muted-foreground uppercase tracking-wide">
                                <div className="col-span-2">Qty</div>
                                <div className="col-span-2">Unit</div>
                                <div className="col-span-7">Ingredient Name</div>
                                <div className="col-span-1"></div>
                            </div>

                            {ingredientFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-3 items-start">
                                    <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.qty`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="1"
                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.unit`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="cup"
                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`ingredients.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-7">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Whole milk"
                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="col-span-1 flex items-center justify-center pt-2">
                                        {form.watch('ingredients').length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeIngredient(index)}
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                onClick={addIngredient}
                                variant="outline"
                                className="w-full py-5 border-2 border-dashed border-border/20 text-secondary hover:border-secondary/30 hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Ingredient
                            </Button>
                        </div>
                    </Card>

                    {/* Instructions */}
                    <Card className="rounded-xl border-none ring ring-ring/30 p-6 mb-6">
                        <h2 className="text-subheading font-semibold text-foreground mb-4">Instructions</h2>

                        <div className="space-y-4">
                            {instructionFields.map((field, index) => {
                                const instruction = instructions[index];
                                return (
                                    <div key={field.id} className="flex gap-4">
                                        <div className="size-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold shrink-0">
                                            {instruction?.step ?? index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`instructions.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-4">
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Preheat the oven to 350°F (177°C). Line a baking sheet with parchment paper."
                                                                    rows={3}
                                                                    className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring focus-visible:ring-secondary/70 focus-within:border-none resize-none mb-2"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex flex-col">

                                                    <FormField
                                                        control={form.control}
                                                        name={`instructions.${index}.duration`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        placeholder="5"
                                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring focus-visible:ring-secondary/70 focus-within:border-none resize-none mb-2"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {instructions.length > 1 && (
                                                        <Button
                                                            size="icon"
                                                            onClick={() => removeInstruction(index)}
                                                            className="shrink-0 w-full bg-destructive/15 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            {instruction?.image && (
                                                <div className="relative inline-block mt-2">
                                                    <img
                                                        src={instruction.image}
                                                        alt={`Step ${instruction.step}`}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                </div>
                                            )}
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="mt-2 flex items-center gap-2"
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) {
                                                            const updated = [...form.getValues('instructions')];
                                                            updated[index].image = URL.createObjectURL(file);
                                                            form.setValue('instructions', updated);
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                            >
                                                <Image className="w-4 h-4" />
                                                {instruction?.image ? 'Change Image' : 'Add Step Image'}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}

                            <Button
                                type="button"
                                onClick={addInstruction}
                                variant="outline"
                                className="w-full py-5 border-2 border-dashed border-border/20 cursor-pointer text-secondary hover:border-secondary/30 hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Next Step
                            </Button>
                        </div>
                    </Card>

                    {/* Cuisines & meal types */}
                    <Card className="rounded-xl border-none ring ring-ring/30 p-6 mb-6">
                        <h2 className="text-subheading font-semibold text-foreground">Cuisine & Meal Type</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    Cuisines
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CUISINES.map(cuisine => (
                                        <Button
                                            key={cuisine}
                                            type="button"
                                            onClick={() => toggleTag('cuisines', cuisine)}
                                            variant="outline"
                                            className={cn(
                                                "rounded-full text-sm cursor-pointer font-medium transition-colors",
                                                form.watch('cuisines').includes(cuisine)
                                                    ? 'bg-secondary/20 text-secondary border-2 border-secondary hover:bg-secondary/30'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            )}
                                        >
                                            {form.watch('cuisines').includes(cuisine) && (
                                                <Check className="w-4 h-4 inline mr-1" />
                                            )}
                                            {cuisine}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-3">
                                    Meal Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {MEAL_TYPES.map(type => (
                                        <Button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleTag('mealTypes', type)}
                                            variant="outline"
                                            className={cn(
                                                "rounded-full cursor-pointer text-sm font-medium transition-colors",
                                                form.watch('mealTypes').includes(type)
                                                    ? 'bg-secondary/20 text-secondary border-2 border-secondary hover:bg-secondary/30'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            )}
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Check className="size-4 text-secondary" />
                            <span className="text-xs">You can always change this later</span>
                        </div>
                        <Button
                            type="submit"
                            className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
                        >
                            Publish Now
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateRecipeForm;