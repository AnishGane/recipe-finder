// backend/src/middleware/multer.ts
import type { Express } from "express";
import multer from "multer";
import path from "path";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const extname = allowedExtensions.test(file.originalname);
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});
// utils/multer-helpers.ts

/**
 * Type-safe helper to extract files from req.files when using upload.fields()
 */
export interface RecipeUploadFiles {
  heroImage?: Express.Multer.File[];
  instructionImages?: Express.Multer.File[];
}

/**
 * Safely extract and type files from multer upload.any() or upload.fields()
 * Handles both exact field names and array notation like instructionImages[0]
 */
export function getUploadedFiles(
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined
): RecipeUploadFiles {
  if (!files) {
    return {};
  }

  // If files is an array (from upload.any()), convert to object
  if (Array.isArray(files)) {
    const result: RecipeUploadFiles = {};
    
    files.forEach((file) => {
      // Handle heroImage
      if (file.fieldname === 'heroImage') {
        if (!result.heroImage) {
          result.heroImage = [];
        }
        result.heroImage.push(file);
      }
      // Handle instructionImages[0], instructionImages[1], etc.
      else if (file.fieldname.startsWith('instructionImages')) {
        if (!result.instructionImages) {
          result.instructionImages = [];
        }
        result.instructionImages.push(file);
      }
    });
    
    return result;
  }

  // If files is an object (from upload.fields())
  return {
    heroImage: files['heroImage'] as Express.Multer.File[] | undefined,
    instructionImages: files['instructionImages'] as Express.Multer.File[] | undefined,
  };
}

/**
 * Get hero image from uploaded files
 */
export function getHeroImage(files: RecipeUploadFiles): Express.Multer.File | undefined {
  return files.heroImage?.[0];
}

/**
 * Get instruction images from uploaded files
 */
export function getInstructionImages(files: RecipeUploadFiles): Express.Multer.File[] {
  return files.instructionImages || [];
}
