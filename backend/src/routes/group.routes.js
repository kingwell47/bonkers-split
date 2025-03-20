import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addMember,
  createGroup,
  deleteGroup,
  getGroupDetails,
  getGroups,
  removeMember,
  updateGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

// Create a new Group
router.post("/", protectRoute, createGroup);

// Get all groups for current user
router.get("/", protectRoute, getGroups);

// TODO: Needs group member check middleware

// Get details for specific group
router.get("/:groupId", protectRoute, getGroupDetails); // NEEDS MIDDLEWARE

// TODO: Below routes need group creator check

// Update group details
router.put("/:groupId", protectRoute, updateGroup); // NEEDS CHECK IF GROUP CREATOR

// Delete a group
router.delete("/:groupId", protectRoute, deleteGroup); // NEEDS CHECK IF GROUP CREATOR

// Add a member to the group
router.post("/:groupId/members", protectRoute, addMember); // NEEDS CHECK IF GROUP CREATOR

// Remove a member from the group
router.delete("/:groupId/members/:memberId", protectRoute, removeMember);

export default router;
