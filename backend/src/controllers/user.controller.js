import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.models.js";
import Group from "../models/group.model.js";

// @desc Get the user with groups populated
// @route GET api/users/me
// @access Private
export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password").populate({
      path: "groups",
      select: "groupName description",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("error in getUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Update the user profile
// @route PUT api/users/update-user
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

// @desc Search for user using email
// @route POST api/users/search
// @access Private
export const searchUser = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUserEmail = req.user.email;

    if (!email) {
      return res.status(400).json({ error: "Email is requried" });
    }

    if (email == currentUserEmail) {
      return res.status(400).json({ message: "You have found...yourself!" });
    }

    const foundUser = await User.findOne({ email }).select("-password");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only send some information
    res.status(200).json({
      _id: foundUser._id,
      email: foundUser.email,
      fullName: foundUser.fullName,
      profilePic: foundUser.profilePic,
      groupsNumber: foundUser.groups.length,
    });
  } catch (error) {
    console.log("error in searchUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Delete own account
// @route DELETE api/users/me
// @access Private
export const deleteOwnAccount = async (req, res) => {
  try {
    // Allows user to delete own account
    // PLACEHOLDER FOR NOW
    res.status(200).json({
      message: "Functionality to be implemented",
    });
  } catch (error) {
    console.log("error in deleteOwnAccount controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Leave a group
// @route DELETE api/users/leave-group/:groupId
// @access Private, Member Only
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { groupId } = req.params;

    // Check if groupId is valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    // Find group by Id
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is a member of the group
    if (!group.members.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You are not a member of this group" });
    }

    // Check if the user is the creator of the group
    if (group.creator.toString() === userId) {
      return res
        .status(400)
        .json({ error: "You cannot leave a group you created" });
    }

    // Remove the user from the group
    group.members.pull(userId);
    await group.save();

    // Remove the group from the user
    await User.findByIdAndUpdate(userId, {
      $pull: { groups: groupId },
    });

    res.status(200).json({ message: "You have left the group" });
  } catch (error) {
    console.log("error in leaveGroup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
