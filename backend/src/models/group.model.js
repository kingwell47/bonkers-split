import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    private: {
      type: Boolean,
      required: true,
      default: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
