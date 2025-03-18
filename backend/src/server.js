import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json()); // To be able to use JSON data

app.use("/api/auth", authRoutes);

app.use("/api/users", (req, res) => {
  res.json({ message: "Users endpoint placeholder" });
});

app.use("/api/groups", (req, res) => {
  res.json({ message: "Groups endpoint placeholder" });
});

app.use("/api/expenses", (req, res) => {
  res.json({ message: "Expenses endpoint placeholder" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
