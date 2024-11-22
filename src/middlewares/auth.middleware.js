import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = async (req, res, next) => {
    try {
        // find the token
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized request",
                success: false
            });
        };
        // verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // find user
        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            // Discuss about frontend
            return res.status(401).json({
                message: "Invaild Access Token",
                success: false
            })
        };
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({
            message: "unAuthorized",
            success: false
        })
    };
};


export { verifyJWT };