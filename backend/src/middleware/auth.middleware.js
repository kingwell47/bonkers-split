import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get the token from the cookies in the request
    const token = req.cookies["jwt-bonkers"];

    // If no token, return error
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Decode the token using the JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If decoded is false or falsy, return an error
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // Find the user in the DB using the userId in the decoded token, unselect the password
    const user = await User.findById(decoded.userId).select("-password");

    // If no user found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the found user to the request...
    req.user = user;

    // ...and then continue to the next function
    next();
  } catch (error) {
    console.log("Error in auth middleware", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};
