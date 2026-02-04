import mongoose from "mongoose";
import { IUser } from "../types";
import RecipeLike from "./RecipeLike.model";
import RecipeSave from "./RecipeSave.model";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isChef: {
      type: Boolean,
      default: false,
    },
    specialties: [
      {
        type: String,
      },
    ],
    followingIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followersIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followerCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    recipeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, username: 1 });

// Referential cleanup: when a User is deleted, remove all RecipeLike and RecipeSave entries
const cleanupUserLikesAndSaves = async (userId: mongoose.Types.ObjectId) => {
  await RecipeLike.deleteMany({ user: userId });
  await RecipeSave.deleteMany({ user: userId });
};

userSchema.pre("deleteOne", { document: true, query: false }, async function () {
  await cleanupUserLikesAndSaves(this._id);
});

userSchema.pre("deleteOne", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean();
  if (doc) {
    await cleanupUserLikesAndSaves(doc._id);
  }
});

userSchema.pre("findOneAndDelete", { document: false, query: true }, async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id").lean();
  if (doc) {
    await cleanupUserLikesAndSaves(doc._id);
  }
});

userSchema.pre("deleteMany", { document: false, query: true }, async function () {
  const docs = await this.model.find(this.getFilter()).select("_id").lean();
  for (const doc of docs) {
    await cleanupUserLikesAndSaves(doc._id);
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
