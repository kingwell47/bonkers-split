import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import groupRoutes from "./routes/group.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "5mb" })); // To be able to use JSON data
app.use(cookieParser()); // To be able to read cookies
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/groups", groupRoutes);

app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
