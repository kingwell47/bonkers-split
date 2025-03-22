import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkGroupMembership } from "../middleware/group.middleware.js";
import {
  addExpense,
  deleteExpense,
  getExpenseDetails,
  getGroupExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";

const router = express.Router();

// Add a new expense
router.post("/:groupId", protectRoute, checkGroupMembership, addExpense);

// Get all expenses for a group
router.get("/:groupId", protectRoute, checkGroupMembership, getGroupExpenses);

// Get details for a specific expense
router.get(
  "/:groupId/:expenseId",
  protectRoute,
  checkGroupMembership,
  getExpenseDetails
);

// Update expense details
router.put(
  "/:groupId/:expenseId",
  protectRoute,
  checkGroupMembership,
  updateExpense
);

// Delete an expense
router.delete(
  "/:groupId/:expenseId",
  protectRoute,
  checkGroupMembership,
  deleteExpense
);

export default router;
