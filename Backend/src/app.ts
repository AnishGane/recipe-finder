// app.ts is the main file for the backend application which will be used to creat the routes and api endpoints for the application
import express from "express";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/auth.route";

const app = express();

// global middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// auth routes
app.use("/api/auth", authRouter);

app.get("/api/health", (_, res) => {
  res.send("OK");
});

export default app;
