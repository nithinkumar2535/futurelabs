import { Router } from "express";
import { sendOTP, verifyOTP } from '../controllers/phoneAuth.controller.js'


const router = Router()

router.route('/send-otp').post(sendOTP)
router.route('/verify-otp').post(verifyOTP)


export default router