import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
        }
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);