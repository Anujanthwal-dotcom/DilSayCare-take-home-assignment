// src/routes/authRoutes.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../config/db";
import { generateToken } from "../utils/auth";
const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db("users")
    .insert({ username, email, password: hashedPassword })
    .returning(["id", "username", "email"]);

  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db("users").where({ email }).first();
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken({ id: user.id, email: user.email });
  res.json({ token });
});

export default router;
