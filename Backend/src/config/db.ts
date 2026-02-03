import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    // Avoid reconnecting on hot reload (especially in dev)
    if (mongoose.connection.readyState === 1) {
      console.log("⚡ Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
