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

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
