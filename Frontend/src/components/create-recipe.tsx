import { Button } from './ui/button';
import CreateRecipeForm from '@/forms/create-recipe-form';

export default function CreateRecipePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-heading font-bold tracking-tight font-sn-pro text-foreground mb-2">Create New Recipe</h1>
                    <Button
                        className="text-sm bg-destructive/20 text-destructive hover:bg-destructive/30 cursor-pointer"
                        onClick={() => {
                            // TODO: Implement discard logic (e.g., navigate away, reset form, show confirmation dialog)
                        }}
                    >
                        Discard Changes
                    </Button>
                </div>

                <CreateRecipeForm />
            </main>
        </div>
    );
}