import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.models.js";

// @desc Update the user profile
// @route POST api/users/update-user
// @access Private
// Currently only profile picture can be updated
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ error: "Profile pic is required" });
    }

    // Upload the profile pic to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Update the user with the profile pic URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is requried" });
    }

    const foundUser = await User.findOne({ email }).select("-password");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: foundUser._id,
      email: foundUser.email,
      fullName: foundUser.fullName,
      profilePic: foundUser.profilePic,
      no_of_groups: foundUser.groups.length,
    });
  } catch (error) {
    console.log("error in searchUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
