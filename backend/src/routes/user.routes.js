import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteOwnAccount,
  getUser,
  searchUser,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get current user
router.get("/me", protectRoute, getUser);

// Search for a user
router.post("/search", protectRoute, searchUser);

// Delete own account
router.delete("/me", protectRoute, deleteOwnAccount);

// Update user
router.put("/update-user", protectRoute, updateProfile);

export default router;
