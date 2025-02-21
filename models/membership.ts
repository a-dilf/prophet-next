import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    lastBurnTxHash: {
      type: String,
      required: true,
    },
    tokensBurned: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
membershipSchema.index({ walletAddress: 1, expiryDate: 1 });

export const MembershipModel = mongoose.models.Membership || mongoose.model("Membership", membershipSchema);
