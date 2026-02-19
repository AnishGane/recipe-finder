import { Request, Response } from "express";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import {
  deleteImageFromCloudinary,
  extractPublicId,
  uploadImageToCloudinary,
} from "../utils/uploadImage";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { generateSlug } from "../utils/helper";
import { randomUUID } from "crypto";
import { sendRegistrationEmail } from "../services/email.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword, name } = req.body || {};

    // Validation
    if (!email || !password || !name) {
      res
        .status(400)
        .json({ error: "Please provide email, password, and name" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
      return;
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res
        .status(400)
        .json({ error: "User already exists with this email or username" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle avatar upload if provided
    let avatarUrl = "";
    if (req.file) {
      try {
        const result = await uploadImageToCloudinary(req.file.buffer, {
          folder: "recipe-platform/avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });
        avatarUrl = result.secure_url;
        console.log("Avatar uploaded successfully:", avatarUrl);
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        // Continue without avatar if upload fails
      }
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      username: generateSlug(name) + "-" + randomUUID().slice(0, 8),
      avatar: avatarUrl || "",
      bio: "",
      isChef: false,
      specialties: [],
      followingIds: [],
      followerIds: [],
      followerCount: 0,
      followingCount: 0,
      recipeCount: 0,
    });

    await user.save();

    // Send welcome email (don't wait for it)
    sendRegistrationEmail(user.email, user.name).catch((error) => {
      console.error("Background email error:", error);
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isChef: user.isChef,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: "Please provide email and password" });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, jwtSecret, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isChef: user.isChef,
        specialties: user.specialties,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        recipeCount: user.recipeCount,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// Get Current User Profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isChef: user.isChef,
        specialties: user.specialties,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        recipeCount: user.recipeCount,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

// Update user Profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, bio, specialties, isChef } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Handle avatar upload if provided
    if (req.file) {
      try {
        // Upload new avatar first
        const result = await uploadImageToCloudinary(req.file.buffer, {
          folder: "recipe-platform/avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });

        // Delete old avatar from Cloudinary only after successful upload
        const oldAvatar = user.avatar;

        user.avatar = result.secure_url;

        // Clean up old avatar (fire-and-forget or log errors)
        if (oldAvatar) {
          const publicId = extractPublicId(oldAvatar);
          deleteImageFromCloudinary(publicId).catch((err) =>
            console.error("Failed to delete old avatar:", err),
          );
        }
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
        res.status(500).json({ error: "Failed to upload avatar" });
        return;
      }
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (specialties) user.specialties = specialties;
    if (isChef !== undefined) user.isChef = isChef;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isChef: user.isChef,
        specialties: user.specialties,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        recipeCount: user.recipeCount,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ error: "Please provide current and new password" });
      return;
    }

    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};
