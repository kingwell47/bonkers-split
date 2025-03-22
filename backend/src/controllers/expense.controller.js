import mongoose from "mongoose";
import User from "../models/user.models.js";
import Group from "../models/group.model.js";
import Expense from "../models/expense.model.js";
import { parse } from "dotenv";

// Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { groupId } = req.params;

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

    // Check if paidBy is a member of the group
    const isMember = group.members.includes(paidBy);

    if (!isMember) {
      return res.status(403).json({
        error: "Access Denied: Paying person is not a member of this group",
      });
    }

    // Check if split share and amount are numbers
    const isNumber = split.every((item) => typeof item.share === "number");

    if (!isNumber) {
      return res.status(400).json({ error: "Split share should be a number" });
    }

    const isAmountNumber = typeof amount === "number";

    if (!isAmountNumber) {
      return res.status(400).json({ error: "Amount should be a number" });
    }

    // Check if split total is equal to the amount
    const totalSplit = split.reduce((acc, item) => acc + item.share, 0);

    if (totalSplit !== amount) {
      return res.status(400).json({
        error: "Split total should be equal to amount",
        totalSplit,
        amount,
      });
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
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if groupId is valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    const groupExpenses = await Expense.find({ group: groupId })
      .populate("group", ["groupName"])
      .populate("paidBy", ["fullName"])
      .populate("split.user", ["fullName"]);

    res.status(200).json(groupExpenses);
  } catch (error) {
    console.log("error in getGroupExpenses controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get details for a specific expense
export const getExpenseDetails = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;

    // Check if groupId and expenseId are valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid expenseId" });
    }

    const expenseDetails = await Expense.findById(expenseId)
      .populate("group", ["groupName"])
      .populate("paidBy", ["fullName"])
      .populate("split.user", ["fullName"]);

    if (!expenseDetails) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expenseDetails);
  } catch (error) {
    console.log("error in getExpenseDetails controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update expense details
export const updateExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;

    const {
      expenseName,
      expenseCategory,
      description,
      amount,
      paidBy,
      date,
      split,
    } = req.body;

    // Check if all required fields are filled in
    if (!expenseName || !amount || !paidBy || !split) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if groupId and expenseId are valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid expenseId" });
    }

    // Check if split share and amount are numbers
    const isNumber = split.every((item) => typeof item.share === "number");

    if (!isNumber) {
      return res.status(400).json({ error: "Split share should be a number" });
    }

    const isAmountNumber = typeof amount === "number";

    if (!isAmountNumber) {
      return res.status(400).json({ error: "Amount should be a number" });
    }

    // Check if split total is equal to the amount
    const totalSplit = split.reduce((acc, item) => acc + item.share, 0);

    if (totalSplit !== amount) {
      return res.status(400).json({
        error: "Split total should be equal to amount",
        totalSplit,
        amount,
      });
    }

    const updatedExpense = {
      expenseName,
      description,
      expenseCategory,
      amount,
      paidBy,
      date,
      split,
    };

    const expense = await Expense.findByIdAndUpdate(expenseId, updatedExpense, {
      new: true,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense successfully updated",
      expense,
    });
  } catch (error) {
    console.log("error in updateExpense controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;

    // Check if groupId and expenseId are valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: "Invalid expenseId" });
    }

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expense.findByIdAndDelete(expenseId);

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.log("error in deleteExpense controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
