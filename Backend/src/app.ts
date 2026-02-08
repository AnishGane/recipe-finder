// app.ts is the main file for the backend application which will be used to creat the routes and api endpoints for the application
import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/auth.route";
import recipeRouter from "./routes/recipe.route";

const app = express();

// global middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both origins
    credentials: true, // Allow credentials if needed
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for FormData

// auth routes
app.use("/api/auth", authRouter);
app.use("/api/recipes", recipeRouter);

app.get("/api/health", (_, res) => {
  res.send("OK");
});

export default app;
