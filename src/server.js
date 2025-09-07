import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"

import { connectDB } from "./lib/db.js"

const app = express()
const PORT = process.env.PORT || 5001

const __dirname = path.resolve()

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.vercel.app", "https://your-custom-domain.com"]
        : "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({
    message: "MERN Backend API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
})

app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = await checkDatabaseConnection()
    res.json({
      status: "healthy",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)

// This is now an API-only backend for Vercel deployment

async function checkDatabaseConnection() {
  const mongoose = await import("mongoose")
  if (mongoose.default.connection.readyState === 1) {
    return "connected"
  } else if (mongoose.default.connection.readyState === 2) {
    return "connecting"
  } else {
    return "disconnected"
  }
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
  })
} else {
  // For Vercel, connect to DB on startup
  connectDB()
}

export default app
