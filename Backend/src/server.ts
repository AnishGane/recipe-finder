import "dotenv/config";
import connectDB from "./config/db";
import app from "./app";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  console.log("Starting server...");
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
