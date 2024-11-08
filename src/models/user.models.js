import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trime: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trime: true,
            index: true
        },
        full_name: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        mobile_no: {
            type: String,
            required: true
        },
        profile_img: {
            type: String, //Cloudinary
            required: true
        },
        cover_img: {
            type: String, //Cloudinary
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

// middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// mathods
userSchema.methods.isPasswordCurrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

// generate AccessToken
userSchema.methods.generateAccessTokens = function () {
    const generatedAccessToken = jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        full_name: this.full_name
    },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
    return generatedAccessToken;
};


// generate refreshToken
userSchema.methods.generateRefreshTokens = async function () {
    const generatedRefreshToken = jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET
        ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
    return generatedRefreshToken;
};

export const User = mongoose.model("User", userSchema);