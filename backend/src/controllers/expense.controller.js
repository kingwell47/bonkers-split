import mongoose from "mongoose";
import User from "../models/user.models.js";
import Group from "../models/group.model.js";
import Expense from "../models/expense.model.js";

// Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;

    console.log(groupId);

    const {
      expenseName,
      expenseCategory,
      description,
      amount,
      paidBy,
      date,
      split,
    } = req.body;

    // Check if group exists
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found in database" });
    }

    // Check if all required fields are filled in
    if (!expenseName || !amount || !paidBy || !split) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newExpense = new Expense({
      expenseName,
      description,
      expenseCategory,
      amount,
      paidBy,
      date,
      split,
      group: groupId,
    });

    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    console.log("error in addExpense controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all expenses for a group

// Get details for a specific expense

// Update expense details

// Delete an expense

// Get all expenses for a user in the group
