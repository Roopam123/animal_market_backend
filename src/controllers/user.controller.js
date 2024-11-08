import { User } from "../models/user.models.js";
import { uploadOnCludinary } from "../utils/Clodinary.js";

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
export { registerUser };