import { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileImageSelectorProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    className?: string;
}

export function ProfileImageSelector({
    value,
    onChange,
    className,
}: ProfileImageSelectorProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    
    // Sync preview with external value changes
    useEffect(() => {
        if (value) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null);

        if (!file) {
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setError("Image size must be less than 5MB");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.onerror = () => {
            setError("Failed to read the image file");
        };
        reader.readAsDataURL(file);

        // Pass file to parent
        onChange(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setError(null);
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <div className="relative">
                {/* Avatar Preview */}
                <div
                    onClick={handleClick}
                    className={cn(
                        "size-24 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary",
                        preview && "border-solid border-destructive"
                    )}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="size-full object-cover"
                        />
                    ) : (
                        <Camera className="size-8 text-muted-foreground" />
                    )}
                </div>

                {/* Remove Button */}
                {preview && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                        }}
                        className="absolute cursor-pointer top-0 right-0 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    >
                        <X className="size-3.5" />
                    </button>
                )}

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Helper Text or Error */}
            <div className="text-center">
                {error ? (
                    <p className="text-xs text-destructive font-medium">{error}</p>
                ) : (
                    <p className="text-xs text-muted/50">
                        Click to upload profile picture
                        <br />
                        <span className="text-[10px]">(Max size: 5MB)</span>
                    </p>
                )}
            </div>
        </div>
    );
}