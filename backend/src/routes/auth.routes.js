import express from "express";
import { login, logout, registerUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-user", protectRoute, (req, res) => {
  res.json({ message: "Successfully accessed protected route" });
});

export default router;
