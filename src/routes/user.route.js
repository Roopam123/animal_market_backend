import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profile_img",
            maxCount: 1
        },
        {
            name: "cover_img",
            maxCount: 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser); //where verifyJWT is a middleware 
router.route("/refresh-token").post(refreshAccessToken); //generating access token

export default router;