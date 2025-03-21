import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkGroupMembership } from "../middleware/group.middleware.js";
import { addExpense } from "../controllers/expense.controller.js";

const router = express.Router();

// Add a new expense
router.post("/:groupId", protectRoute, checkGroupMembership, addExpense);
// Get all expenses for a group

// Get details for a specific expense

// Update expense details

// Delete an expense

// Get all expenses for a user in the group

export default router;
