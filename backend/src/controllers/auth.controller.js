import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

// @desc Register a user
// @route POST api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if all fields are populated
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if Password length is correct
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if email is in valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user email is already used
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create salt and then hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // if this user is new, generate a token and save the user into the db
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      //Send the information as a response json
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in registration controller", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};

// @desc Login using the password
// @route POST api/auth/login
// @access Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // If no user found, return error
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // If password is correct generate a token and send the cookie
    generateToken(user._id, res);

    // Send the user details back as a response json
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};

// @desc Logout and destroy the token
// @route POST api/auth/login
// @access Public
export const logout = async (req, res) => {
  try {
    // Remove the token and send a response json
    res.cookie("jwt-bonkers", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};

// @desc Check if user is authenticated or not
// @route POST api/auth/check
// @access Private
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};
