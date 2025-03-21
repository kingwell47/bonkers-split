import mongoose from "mongoose";
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
      creator: currentUserId,
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

// @desc Get all groups for current user
// @route GET api/groups
// @access Private
export const getGroups = async (req, res) => {
  try {
    const userGroups = req.user.groups;

    // Check if Ids are Valid
    const validIds = userGroups.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    // Fetch groups matching the valid IDs, selecting only 'name' and 'description' fields,
    // and adding the count of members
    const populatedGroups = await Group.aggregate([
      {
        $match: {
          _id: { $in: validIds },
        },
      },
      {
        $project: {
          groupName: 1,
          description: 1,
          memberCount: { $size: "$members" },
        },
      },
    ]);

    res.status(200).json(populatedGroups);
  } catch (error) {
    console.log("error in getGroups controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Get details for specific group
// @route GET api/groups/:groupId
// @access Private
export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if groupId is valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    const groupDetails = await Group.findById(groupId);

    if (!groupDetails) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(groupDetails);
  } catch (error) {
    console.log("error in getGroupDetails controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Update group details
// @route PUT api/groups/:groupId
// @access Private, Creator Only
export const updateGroup = async (req, res) => {
  try {
    const { newGroupName, newGroupDescription, newGroupPrivate } = req.body;
    const { groupId } = req.params;

    // Check if groupName is filled in
    if (!newGroupName) {
      return res.status(400).json({ error: "Group name is required" });
    }

    // Check if groupId is valid
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    // Find group by Id
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const oldGroup = {
      oldGroupName: group.groupName,
      oldGroupDescription: group.description,
      oldGroupPrivate: group.private,
    };

    // Check if any changes are made
    if (
      oldGroup.oldGroupName === newGroupName &&
      oldGroup.oldGroupDescription === newGroupDescription &&
      oldGroup.oldGroupPrivate === newGroupPrivate
    ) {
      return res.status(400).json({ error: "No changes made" });
    }

    // Update group details
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      {
        groupName: newGroupName,
        description: newGroupDescription,
        private: newGroupPrivate,
      },
      { new: true }
    ).select("-members");

    res
      .status(200)
      .json({ message: "Group updated successfully", oldGroup, updatedGroup });
  } catch (error) {
    console.log("error in updateGroup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Delete a group
// @route DELETE api/groups/:groupId
// @access Private, Creator Only
export const deleteGroup = async (req, res) => {
  try {
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

    // Check if the user is the creator of the group
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({ error: "You are not authorized" });
    }

    // Update the user's groups array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { groups: groupId },
    });

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.log("error in deleteGroup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a member to the group
// @route POST api/groups/:groupId/members/:memberId
// @access Private, Creator Only
export const addMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    // Check if groupId and memberId are valid
    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(memberId)
    ) {
      return res.status(400).json({ error: "Invalid groupId or memberId" });
    }

    // Find group by Id
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if member is already in the group
    if (group.members.includes(memberId)) {
      return res
        .status(400)
        .json({ error: "Member already exists in the group" });
    }

    // Check if member exists
    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Add member to the group
    await Group.findByIdAndUpdate(groupId, {
      $push: { members: memberId },
    });

    // Update the user's groups array
    await User.findByIdAndUpdate(memberId, {
      $push: { groups: groupId },
    });

    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    console.log("error in addMember controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a member from the group
export const removeMember = async (req, res) => {
  res.json({ message: "Under Construction" });
};
