import { Router } from "express";
import { forgotPasword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/register").post(registerUser);
router.route('/login').post(loginUser)
router.route('/refresh-token').post(refreshAccessToken)

//secured routes

router.route('/logout').post(verifyJWT, logoutUser)
router.route('/get-user').get(verifyJWT, getCurrentUser)
router.route('/forgot-password').post(forgotPasword)
router.route('/reset-password').patch(resetPassword)
router.route('/check-auth').get(verifyJWT, (req, res) => {
    const user = req.user;
    res
    .status(200)
    .json(new ApiResponse(200, user, "Current user"))
})


export default router 