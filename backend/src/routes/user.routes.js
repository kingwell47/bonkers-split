import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { searchUser, updateProfile } from "../controllers/user.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

// Get current user
router.get("/me", protectRoute, checkAuth);

// Search for a user
router.post("/search", protectRoute, searchUser);

// Update user
router.put("/update-user", protectRoute, updateProfile);

export default router;
