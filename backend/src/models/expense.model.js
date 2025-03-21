import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    expenseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    expenseCategory: {
      type: String,
      enum: [
        "Food & Dining",
        "Groceries",
        "Rent",
        "Utilities",
        "Transportation",
        "Entertainment",
        "Shopping",
        "Health & Fitness",
        "Travel",
        "Debt & Loans",
        "Other",
      ],
      required: true,
      default: "Other",
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    split: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        share: { type: Number, required: true }, // Amount each user owes
      },
    ],
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
