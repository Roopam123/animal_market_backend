import { User } from "../models/user.models.js";
import { uploadOnCludinary } from "../utils/Clodinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = await user.generateAccessTokens();
        const refreshToken = await user.generateRefreshTokens();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); //{ validateBeforeSave: false } don't check the required value please save this
        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error on the generateAccessAndRefreshToken funcrion", error);
    }
}

const registerUser = async (req, res) => {
    try {
        const { username, email, full_name, bio, mobile_no, password } = req.body;
        if (!username || !email || !full_name || !mobile_no || !password) {
            return res.status(400).json({
                message: "All fields is required!!",
                success: false
            })
        };
        // check exist user
        const existUser = await User.findOne({
            $or: [{ username }, { mobile_no }]
        })
        if (existUser) {
            return res.status(409).json({
                message: "User already register with same email id and mobile_no",
                success: false
            })
        };
        // User id shuld be unique

        const checkUserId = await User.findOne({ username });
        if (checkUserId) {
            return res.status(400).json({
                message: "please take diffrent username",
                success: false
            })
        };

        // profile image
        const profileImg = req.files["profile_img"] ? req.files["profile_img"][0].path : null;
        const coverImg = req.files["cover_img"] ? req.files["cover_img"][0].path : null;
        if (!profileImg) {
            return res.status(400).json({
                message: "Profile Image is requried 1",
                success: false
            });
        };

        // Profile and cover image upload on clodinary
        const profileCloudImg = await uploadOnCludinary(profileImg);
        const cover_imgCloudImg = await uploadOnCludinary(coverImg);
        if (!profileCloudImg) {
            return res.status(400).json({
                message: "Profile Image is requried 2",
                success: false
            })
        };

        // save in db 
        const user = await User.create({
            username,
            email,
            full_name,
            bio,
            mobile_no,
            password,
            profile_img: profileCloudImg?.url,
            cover_img: cover_imgCloudImg?.url
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        return res.status(200).json({
            message: `${full_name} register successfully`,
            success: true,
            createdUser
        })

    } catch (error) {
        console.log("Error on the registerUser function", error);
    }
}

const loginUser = async (req, res) => {
    try {
        // 1. req body --> data
        const { email, password, username } = req.body;

        // 2. data validation
        if ((!email || !username) && !password) {
            return res.status(400).json({
                message: "All feilds are required!!",
                success: false
            })
        };

        // 3. find user
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({
                message: "User is not registered!!",
                success: false
            })
        };

        //4. comapre password
        const isPasswordValid = await user.isPasswordCurrect(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            });
        };

        // 5. generate access and refresh token and save on db
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password");
        return res.status(200).json({
            message: `${loggedInUser?.full_name} is successfully login`,
            success: true,
            loggedInUser,
            accessToken,
        });
    } catch (error) {
        console.log("Error on the loginUser function", error);
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        );
        return res.status(200).json({
            message: "User logout successfully",
            success: true
        });
    } catch (error) {
        console.log("Error on the logoutUser function", error);
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({
                message: "refrsh token is required!!",
                success: false
            })
        };

        // verify the refresh token and decode
        const decodedRefreshToken = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefreshToken?._id); //find the user
        if (!user) {
            return res.status(400).json({
                message: "Invaild refreshToken 1",
                success: false
            })
        };

        // compare the incomming refreshToken and db save refreshToken
        console.log(user?.refreshToken);
        if (refresh_token !== user?.refreshToken) {
            return res.status(400).json({
                message: "Invaild refreshToken 2",
                success: false
            })
        };

        // generate the new access And refresh token

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);
        return res.status(200).json({
            message: "access token reset successfully",
            success: true,
            accessToken,
            refreshToken
        })


    } catch (error) {
        console.log("Error on the refreshAccessToken", error);
    }
};



export { registerUser, loginUser, logoutUser, refreshAccessToken };