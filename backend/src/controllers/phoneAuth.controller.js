import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios'
import { phoneUser } from '../models/phoneAuth.model.js';
import sendSMS from '../utils/sms.js';
import { sendEmail } from "../utils/emailService.js";

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
    user.lastLogin = Date.now();
    await user.save()

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await phoneUser.findById(user._id).select("-refreshToken")

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while logging in the user")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none'
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN, 
        subject: "User Login Notification",
        text: `A user has successfully logged in with the phone number: ${phone}`,
    };

     try {
            // Send email to admin
            const response = await sendEmail(mailOptions);
            console.log('Email sent:', response);
        } catch (err) {
            console.error('Error sending email:', err);
            throw new ApiError(404, "Error sending mail")
        }

    
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( new ApiResponse(200, {loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
    
})

const logoutUser = asyncHandler ( async (req, res) => {
    await phoneUser.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:'none'
        
        
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json( new ApiResponse(200, {}, "User logged out successfully"))
})

const getLoggedInUsers = asyncHandler(async (req, res) => {
    const loggedInUsers = await phoneUser.find({ lastLogin: { $exists: true } }).select("phone lastLogin");

    if (!loggedInUsers || loggedInUsers.length === 0) {
        throw new ApiError(404, "No logged-in users found");
    }

    return res.status(200).json(new ApiResponse(200, { loggedInUsers }, "Logged-in users fetched successfully"));
});


export {sendOTP,
        verifyOTP, 
        logoutUser,
        getLoggedInUsers
}