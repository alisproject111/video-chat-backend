import express from "express"
import { login, logout, onboard, signup, getMe } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.use((req, res, next) => {
  console.log(`[v0] Auth route accessed: ${req.method} ${req.path}`)
  console.log(`[v0] Full URL: ${req.originalUrl}`)
  console.log(`[v0] Headers:`, req.headers)
  next()
})

router.get("/test-auth", (req, res) => {
  console.log("[v0] Auth test route hit successfully")
  res.json({
    message: "Auth router is working!",
    timestamp: new Date().toISOString(),
    path: req.path,
    originalUrl: req.originalUrl,
  })
})

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

// check if user is logged in
router.get("/me", protectRoute, getMe)

router.get("/debug", (req, res) => {
  console.log("[v0] Debug endpoint - All cookies:", req.cookies)
  console.log("[v0] Debug endpoint - Raw cookie header:", req.headers.cookie)
  res.json({
    cookies: req.cookies,
    rawCookieHeader: req.headers.cookie,
    hasJwtCookie: !!req.cookies.jwt,
    timestamp: new Date().toISOString(),
  })
})

export default router
