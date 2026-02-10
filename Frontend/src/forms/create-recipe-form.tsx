import { BsCameraFill } from "react-icons/bs";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Plus, Image, Clock, ChefHat, Trash2Icon, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
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
import { CUISINES, DIFFICULTY_LEVELS, MEAL_TYPES } from "@/constants";
import { recipeFormSchema, type RecipeFormValues } from "@/validations/create-recipe-schema";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/api/api";
import type { InstructionImageFile } from "@/types";

const CreateRecipeForm = () => {
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [instructionImageFiles, setInstructionImageFiles] = useState<InstructionImageFile[]>([]);

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
            cuisine: 'Italian',
            mealType: 'Dinner',
            tags: ""
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

    const { mutateAsync: createRecipeMutate, isPending: isCreatingRecipe } = useMutation({
        mutationKey: ['createRecipe'],
        mutationFn: (formData: FormData) => createRecipe(formData),
    });

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (heroImage) {
                URL.revokeObjectURL(heroImage);
            }
            const objectUrl = URL.createObjectURL(file);
            setHeroImage(objectUrl);
            setHeroImageFile(file);
        }
    };

    const handleInstructionImageUpload = (index: number, file: File) => {
        const objectUrl = URL.createObjectURL(file);

        // Update form state with preview URL
        const updatedInstructions = [...form.getValues('instructions')];
        updatedInstructions[index].image = objectUrl;
        form.setValue('instructions', updatedInstructions);

        // Store the actual file for upload
        setInstructionImageFiles(prev => {
            const filtered = prev.filter(img => img.index !== index);
            return [...filtered, { index, file, preview: objectUrl }];
        });
    };

    const removeInstructionImage = (index: number) => {
        const instruction = instructions[index];

        // Revoke object URL
        if (instruction?.image) {
            URL.revokeObjectURL(instruction.image);
        }

        // Remove from form state
        const updatedInstructions = [...form.getValues('instructions')];
        updatedInstructions[index].image = null;
        form.setValue('instructions', updatedInstructions);

        // Remove from file storage
        setInstructionImageFiles(prev => prev.filter(img => img.index !== index));
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
            // Clean up instruction image if exists
            removeInstructionImage(index);

            removeInstructionField(index);

            // Reindex remaining instruction images
            setInstructionImageFiles(prev =>
                prev
                    .filter(img => img.index !== index)
                    .map(img => ({
                        ...img,
                        index: img.index > index ? img.index - 1 : img.index
                    }))
            );
        }
    };


    const onSubmit = async (data: RecipeFormValues) => {
        console.log('Form Data:', data);
        console.log('Hero Image file:', heroImageFile);
        console.log('Instruction Image files:', instructionImageFiles);

        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('prepTime', data.prepTime);
        formData.append('cookTime', data.cookTime);
        formData.append('servings', data.servings);
        formData.append('difficulty', data.difficulty.toLocaleLowerCase());

        // Backend expects single cuisine and mealType
        if (data.cuisine) {
            formData.append('cuisine', data.cuisine.toLowerCase());
        }
        if (data.mealType) {
            formData.append('mealType', data.mealType.toLowerCase());
        }

        // Map ingredients to backend format
        formData.append(
            'ingredients',
            JSON.stringify(
                data.ingredients.map((ingredient) => ({
                    name: ingredient.name,
                    quantity: Number(ingredient.qty) || 0,
                    unit: ingredient.unit,
                })),
            ),
        );

        // Prepare instructions (without image URLs, those will be added by backend)
        const instructionsForBackend = data.instructions.map((inst) => ({
            step: inst.step,
            description: inst.description,
            duration: inst.duration,
            image: null, // Will be populated by backend after upload
        }));

        formData.append('instructions', JSON.stringify(instructionsForBackend));

        // Process tags: split by comma and trim each tag
        const tagsArray = data.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
        formData.append('tags', JSON.stringify(tagsArray));
        formData.append('isPublished', 'true');

        // Append hero image
        if (heroImageFile) {
            formData.append('heroImage', heroImageFile);
        }

        // Append instruction images with their indices
        // Using array notation so backend can match images to instruction steps
        instructionImageFiles.forEach((imgFile) => {
            formData.append(`instructionImages[${imgFile.index}]`, imgFile.file);
        });

        try {
            const response = await createRecipeMutate(formData);
            console.log('Recipe created successfully:', response);

            // Clean up object URLs
            if (heroImage) {
                URL.revokeObjectURL(heroImage);
            }
            instructionImageFiles.forEach(img => {
                URL.revokeObjectURL(img.preview);
            });

            if (response.success) {
                form.reset();
            }
        } catch (error) {
            console.error('Failed to create recipe:', error);
        }
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
                                    <span className="px-6 py-2.5 bg-secondary rounded-lg text-muted font-medium cursor-pointer transition-colors inline-block text-sm hover:bg-secondary/80">
                                        Select Photo
                                    </span>
                                </label>
                            </>
                        ) : (
                            <div className="relative">
                                <img src={heroImage} alt="Hero" className="w-full h-full object-cover rounded-lg" />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (heroImage) {
                                            URL.revokeObjectURL(heroImage);
                                        }
                                        setHeroImage(null);
                                        setHeroImageFile(null);
                                    }}
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
                                                <div className="flex flex-col gap-2">
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
                                                                        className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring focus-visible:ring-secondary/70 focus-within:border-none"
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
                                                            type="button"
                                                            size="icon"
                                                            onClick={() => removeInstruction(index)}
                                                            className="shrink-0 w-full bg-destructive/15 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 cursor-pointer"
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Instruction Image Preview */}
                                            {instruction?.image && (
                                                <div className="relative inline-block mt-2">
                                                    <img
                                                        src={instruction.image}
                                                        alt={`Step ${instruction.step}`}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg"
                                                        onClick={() => removeInstructionImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Image Upload Button */}
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
                                                            handleInstructionImageUpload(index, file);
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
                                );
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
                        <h2 className="text-subheading font-semibold text-foreground mb-4">Cuisine & Meal Type</h2>

                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="cuisine"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cuisine</FormLabel>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {CUISINES.map(cuisine => (
                                                <Button
                                                    type="button"
                                                    variant={"secondary"}
                                                    className={cn("text-foreground bg-secondary/40 cursor-pointer", field.value === cuisine && "bg-secondary")}
                                                    onClick={() => field.onChange(cuisine)}
                                                >
                                                    {cuisine}
                                                </Button>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mealType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Type</FormLabel>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {MEAL_TYPES.map(type => (
                                                <Button
                                                    type="button"
                                                    variant={"secondary"}
                                                    className={cn("text-foreground bg-secondary/40 cursor-pointer", field.value === type && "bg-secondary")}
                                                    onClick={() => field.onChange(type)}
                                                >
                                                    {type}
                                                </Button>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>

                    <Card className="rounded-xl border-none ring ring-ring/30 p-6 mb-6">
                        <h2 className="text-subheading font-semibold text-foreground mb-1">Tags for your recipe</h2>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. healthy, vegan, vegetarian"
                                                className="placeholder:text-muted-foreground/60 ring ring-ring/40 [html.dark_&]:border-none focus-visible:ring-secondary/70 focus-within:border-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Separate tags with a comma
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className="text-xs">You can always change this later</span>
                        </div>
                        <Button
                            type="submit"
                            className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
                            disabled={isCreatingRecipe}
                        >
                            {isCreatingRecipe ? 'Publishing...' : 'Publish Now'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateRecipeForm;