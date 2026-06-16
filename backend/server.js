// backend/server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Error Handling
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import AppError from "./utils/AppError.js";

dotenv.config();

const app = express();

/* ============================
   GLOBAL MIDDLEWARE
============================ */

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* ============================
   HEALTH CHECK
============================ */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 PlacementorAI Backend Running!",
  });
});

/* ============================
   API ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);

/* ============================
   404 HANDLER
============================ */
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    )
  );
});

/* ============================
   GLOBAL ERROR HANDLER
============================ */
app.use(globalErrorHandler);

/* ============================
   DATABASE CONNECTION
============================ */
const PORT = process.env.PORT || 5000;

let server;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

/* ============================
   GRACEFUL SHUTDOWN
============================ */
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down...`);

  try {
    if (server) {
      server.close(() => {
        console.log("✅ HTTP Server Closed");
      });
    }

    await mongoose.connection.close();
    console.log("✅ MongoDB Connection Closed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Shutdown Error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

/* ============================
   UNHANDLED ERRORS
============================ */
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION:", err);
  gracefulShutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

/* ============================
   START SERVER
============================ */
connectDB();