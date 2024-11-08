import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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
)

export default router;