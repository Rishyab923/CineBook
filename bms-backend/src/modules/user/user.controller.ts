import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as UserService from "./user.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    await UserService.createUser({ username, email, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    // Duplicate email error
    if (error.code === 11000) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    res.status(500).json({
      message: error.message || "Signup failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.validateUser(email, password);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    username: user.username, // ✅ REQUIRED
  },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);


    res.json({ success: true, token });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
