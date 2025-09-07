import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
  try {
    console.log("[v0] Auth middleware - Cookies received:", req.cookies)
    console.log("[v0] Auth middleware - Headers:", req.headers.cookie)

    const token = req.cookies.jwt

    if (!token) {
      console.log("[v0] Auth middleware - No JWT token found in cookies")
      return res.status(401).json({ message: "Unauthorized - No token provided" })
    }

    console.log("[v0] Auth middleware - Token found, verifying...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (!decoded) {
      console.log("[v0] Auth middleware - Token verification failed")
      return res.status(401).json({ message: "Unauthorized - Invalid token" })
    }

    console.log("[v0] Auth middleware - Token verified, finding user:", decoded.userId)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      console.log("[v0] Auth middleware - User not found for ID:", decoded.userId)
      return res.status(401).json({ message: "Unauthorized - User not found" })
    }

    console.log("[v0] Auth middleware - User authenticated successfully:", user.email)
    req.user = user

    next()
  } catch (error) {
    console.log("Error in protectRoute middleware", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
