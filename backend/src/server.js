import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json()); // To be able to use JSON data
app.use(cookieParser()); // To be able to read cookies

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/groups", groupRoutes);

app.use("/api/expenses", (req, res) => {
  res.json({ message: "Expenses endpoint placeholder" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
