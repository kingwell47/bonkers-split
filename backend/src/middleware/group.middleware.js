import Group from "../models/group.model.js";

export const checkGroupMembership = async (req, res, next) => {
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
