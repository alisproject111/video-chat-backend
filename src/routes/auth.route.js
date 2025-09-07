import express from "express"
import { login, logout, onboard, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

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
