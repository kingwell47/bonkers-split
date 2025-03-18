import jwt from "jsonwebtoken";

// Generate token using JWT Secret
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Add options to the cookies to prevent attacks
  res.cookie("jwt-bonkers", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
    httpOnly: true, // Prevents XSS Attacks
    sameSite: "strict", // For CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
