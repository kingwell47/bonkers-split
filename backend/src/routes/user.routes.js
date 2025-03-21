import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteOwnAccount,
  getUser,
  leaveGroup,
  searchUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { checkGroupMembership } from "../middleware/group.middleware.js";

const router = express.Router();

// Get current user
router.get("/me", protectRoute, getUser);

// Search for a user
router.post("/search", protectRoute, searchUser);

// Delete own account
router.delete("/me", protectRoute, deleteOwnAccount);

// Update user
router.put("/update-user", protectRoute, updateProfile);

// Leave group
router.delete(
  "/leave-group/:groupId",
  protectRoute,
  checkGroupMembership,
  leaveGroup
);

export default router;
