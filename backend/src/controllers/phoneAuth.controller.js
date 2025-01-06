import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios'
import { phoneUser } from '../models/phoneAuth.model.js';
import sendSMS from '../utils/sms.js';

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await phoneUser.findById(userId)
    
        if(!user){
            throw new ApiError(400, "User not found")
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }

}

const sendOTP = asyncHandler(async (req, res) => {
    
    const {phone} = req.body

    if(!phone) {
        throw new ApiError(400, "Phone number is required")
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000)

    const user = await phoneUser.findOneAndUpdate(
        {phone},
        {otp, otpCreatedAt: Date.now()},
        {new: true, upsert: true}
    )
    const response = await sendSMS(otp, phone)

    console.log(response);
    
    
    
    return res
        .status(200)
        .json(new ApiResponse(200, null, "OTP sent successfully"))

    
})

const verifyOTP = asyncHandler(async(req, res)=>{
    const {phone, otp} = req.body

    if (!phone || !otp) {
        throw new ApiError(400, "Phone number and OTP is required")
    }
    const user = await phoneUser.findOne({ phone })

    if(!user) {
        throw new ApiError(404, "User not found")
    }

    const isOtpValid = user.otp === otp && Date.now() - new Date(user.otpCreatedAt).getTime() <= 5 * 60 * 1000 ;

    if (!isOtpValid) {
        throw new ApiError(400, "Invalid or expired OTP")
    }

    user.otp = null
    user.otpCreatedAt = null
    await user.save()

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await phoneUser.findById(user._id).select("-refreshToken")

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while logging in the user")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    console.log("refreshToken:",accessToken );
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( new ApiResponse(200, {loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
    
})

export {sendOTP,
    verifyOTP
}