// backend/src/utils/uploadImage.ts
import cloudinary from "../config/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

interface UploadOptions {
  folder?: string;
  transformation?: any[];
  public_id?: string;
}

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer from multer
 * @param options - Upload options (folder, transformation, etc.)
 * @returns Promise with Cloudinary upload response
 */
export const uploadImageToCloudinary = (
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    console.log("Starting Cloudinary upload...");

    // Simplified transformation format for better compatibility
    const transformation = options.transformation || [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto" },
    ];

    const uploadOptions: any = {
      folder: options.folder || "recipe-platform",
      resource_type: "image",
      // Use array of transformation objects
      transformation: transformation,
    };

    if (options.public_id) {
      uploadOptions.public_id = options.public_id;
    }

    console.log("Upload options:", JSON.stringify(uploadOptions, null, 2));

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          console.error("Cloudinary upload error:", {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          });
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          console.log("Cloudinary upload successful");
          console.log("URL:", result.secure_url);
          console.log("Public ID:", result.public_id);
          resolve(result);
        } else {
          reject(new Error("Cloudinary upload failed: No result returned"));
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Promise with deletion result
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<any> => {
  try {
    console.log("Deleting image from Cloudinary:", publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Image deleted:", result);
    return result;
  } catch (error) {
    console.error("Failed to delete image:", error);
    throw new Error(`Failed to delete image: ${(error as Error).message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
export const extractPublicId = (url: string): string => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Get everything after 'upload/v1234567890/'
    const relevantParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
    const filename = relevantParts.join("/").split(".")[0]; // Remove extension

    console.log("Extracted public ID:", filename);
    return filename;
  } catch (error) {
    console.error("Failed to extract public ID from URL:", url);
    throw error;
  }
};
