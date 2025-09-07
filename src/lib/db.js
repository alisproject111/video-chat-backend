import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
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
