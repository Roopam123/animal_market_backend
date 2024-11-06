import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        mobile_no: {
            type: String,
            required: true,
            unique: true,
        },
        bio: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            unique: true,
        },
        profile_photo: {
            type: String
        },
        cover_photo: {
            type: String
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);