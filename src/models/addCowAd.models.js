import mongoose from "mongoose";


const addCowAdSchema = new mongoose.Schema(
    {

    },
    { timestamps: true }
);


const AddCowAd = mongoose.model("AddCowAd", addCowAdSchema);
