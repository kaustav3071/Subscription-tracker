import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '7d', // Match JWT lifetime (7 days)
        },
    },
    { timestamps: true }
);

const BlacklistToken = mongoose.models.BlacklistToken || mongoose.model("BlacklistToken", blacklistTokenSchema);
export default BlacklistToken;