import { Router } from "express";
import { getLoggedInUsers, logoutUser, sendOTP, verifyOTP } from '../controllers/phoneAuth.controller.js'
import { verifyPhoneJWT } from "../middlewares/phoneAuth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT} from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/send-otp').post(sendOTP)
router.route('/verify-otp').post(verifyOTP)
router.route('/check-auth').get(verifyPhoneJWT, (req, res) => {
    const user = req.user;
    res
    .status(200)
    .json(new ApiResponse(200, user, "Current user"))
})
router.route('/logout').post(verifyPhoneJWT, logoutUser)
router.route('/users').get(verifyJWT, getLoggedInUsers)


export default router