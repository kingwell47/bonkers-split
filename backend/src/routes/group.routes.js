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
import {
  checkGroupCreator,
  checkGroupMembership,
} from "../middleware/group.middleware.js";

const router = express.Router();

// Create a new Group
router.post("/", protectRoute, createGroup);

// Get all groups for current user
router.get("/", protectRoute, getGroups);

// TODO: Needs group member check middleware

// Get details for specific group
router.get("/:groupId", protectRoute, checkGroupMembership, getGroupDetails);

// Update group details
router.put("/:groupId", protectRoute, checkGroupCreator, updateGroup);

// Delete a group
router.delete("/:groupId", protectRoute, checkGroupCreator, deleteGroup);

// Add a member to the group
router.post(
  "/:groupId/members/:memberId",
  protectRoute,
  checkGroupCreator,
  addMember
);

// Remove a member from the group
router.delete(
  "/:groupId/members/:memberId",
  protectRoute,
  checkGroupCreator,
  removeMember
);

export default router;
