import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected")
      return mongoose.connection
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Added connection pooling
      bufferCommands: false, // Disable mongoose buffering for serverless
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB")
    })

    mongoose.connection.on("error", (err) => {
      console.log("Mongoose connection error:", err)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected")
    })

    return conn
  } catch (error) {
    console.log("Error in connecting to MongoDB", error)
    if (process.env.NODE_ENV !== "production") {
      process.exit(1)
    }
    throw error
  }
}
