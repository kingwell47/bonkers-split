import mongoose from "mongoose";
import Group from "../models/group.model.js";

export const checkGroupMembership = async (req, res, next) => {
  try {
    const { groupId } = req.params; // Group ID passed from Params
    const userId = req.user.id;

    // Check if group ID is valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        error: "Invalid Group ID",
      });
    }

    // Find Group, return error if not found
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        error: "Group Middleware: Group not found",
      });
    }

    // Check if user's ID is in the group's members array
    const isMember = group.members.includes(userId);

    if (!isMember) {
      return res.status(403).json({
        error: "Access Denied: You are not a member of this group",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkGroupMembership middleware", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};

export const checkGroupCreator = async (req, res, next) => {
  try {
    const groupId = req.params.groupId; // Group ID passed from Params
    const userId = req.user.id;

    // Find Group, return error if not found
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        error: "Group not found",
      });
    }

    // Check if user's ID is the creator of the group
    if (group.creator.toString() !== userId) {
      return res.status(403).json({
        error: "Access Denied: You are not the creator of this group",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkGroupCreator middleware", error.message);
    res.status(500).json({ error: "Interal Server Error" });
  }
};
