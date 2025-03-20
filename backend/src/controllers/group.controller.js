import User from "../models/user.models.js";
import Group from "../models/group.model.js";

// @desc Create a new group
// @route POST api/groups
// @access Private
export const createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const currentUserId = req.user.id;

    //Check if groupName is filled in
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const newGroup = new Group({
      groupName,
      description: req.body.description,
      members: [currentUserId],
      private: req.body.private,
    });

    await newGroup.save();

    await User.findByIdAndUpdate(currentUserId, {
      $push: { groups: newGroup._id },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.log("error in createGroup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all groups for current user
export const getGroups = async (req, res) => {
  res.json({ message: "Under Construction" });
};

// Get details for specific group
export const getGroupDetails = async (req, res) => {
  res.json({ message: "Under Construction" });
};

// Update group details
export const updateGroup = async (req, res) => {
  res.json({ message: "Under Construction" });
};

// Delete a group
export const deleteGroup = async (req, res) => {
  res.json({ message: "Under Construction" });
};

// Add a member to the group
export const addMember = async (req, res) => {
  res.json({ message: "Under Construction" });
};

// Remove a member from the group
export const removeMember = async (req, res) => {
  res.json({ message: "Under Construction" });
};
