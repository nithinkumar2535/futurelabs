import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import {upload} from '../middlewares/multer.middleware.js'
import { sendEmail } from "../utils/emailService.js";
import { v4 as uuidv4 } from 'uuid';



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
    
        if(!user){
            throw new ApiError(400, "User not found")
        }
    
        const adminAccessToken = user.generateAccessToken()
        const adminRefreshToken = user.generateRefreshToken()
    
        user.refreshToken = adminRefreshToken
        await user.save({validateBeforeSave: false})
        return {adminAccessToken, adminRefreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }

}


const registerUser = asyncHandler( async (req, res) =>{
    const {username, email, password} = req.body;

    //validation
    if(!username || !email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
        
    }


    

    const user = await User.create({
      username,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body;

    if(!email){
        throw new ApiError(400, "Email is required")
    }
    if(!password){
        throw new ApiError(400, "Password is required")
    }

    const  user = await User.findOne({email})
    if(!user){
        throw new ApiError(409, "Invalid email")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(409, "Invalid password");
    }

    const {adminAccessToken, adminRefreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!loggedInUser){
        throw new ApiError(500, "something went wrong while logging in the user")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'none'
    }

    return res
        .status(200)
        .cookie("adminAccessToken", adminAccessToken, options)
        .cookie("adminRefreshToken", adminRefreshToken, options)
        .json( new ApiResponse(200, {loggedInUser, adminAccessToken, adminRefreshToken}, "User logged in successfully"))
        
        

})

const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
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
        sameSite: 'none'
    }

    return res
        .status(200)
        .clearCookie("adminAccessToken", options)
        .clearCookie("adminRefreshToken", options)
        .json( new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.adminRefreshToken || req.body.adminRefreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_ADMIN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        
        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        
        if (incomingRefreshToken !== user.refreshToken) {
          throw new ApiError(401, "Invalid refresh token");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const {adminAccessToken, adminRefreshToken: adminNewRefreshToken} = 
        await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", adminAccessToken, options)
            .cookie("refreshToken", adminNewRefreshToken, options)
            .json( new ApiResponse(200, {adminAccessToken, adminRefreshToken: adminNewRefreshToken}, "Access token refreshed successfully"))

    } catch (error) {
        throw new ApiError(500, "Something went wrong while refreshing access token")
    }
})

const getCurrentUser = asyncHandler ( async (req, res) => {
    return res.status(200)
        .json( new ApiResponse(200, req.user, "Current user details"))
})

const forgotPasword = asyncHandler (async (req, res) => {
   

    const { email } = req.body;

    const user = await User.findOne({email})

    if (!user ) {
        throw new ApiError(401, "Invalid email")
    }

    const userId = user._id
    const token = uuidv4()
    user.forgotPasswordToken = token;
    user.forgotPasswordExpiry = Date.now() + 300000;

    await user.save()

    const mailOptions = {
        from: 'nithin@fitmywealth.com',
        to: email,
        subject: 'Password Reset',
        html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Forgot Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              width: 100vw;
              height: 100vh;
              display: flex;
              justify-content: center;
            }
        
            .container {
              width: 90%;
              padding: 30px;
              border-radius: 5px;
            }
        
            h1 {
              text-align: center;
              margin-top: 0;
            }
        
            p {
              line-height: 1.5;
            }
        
            .button {
              display: block;
              background-color: #da4444;
              color: #fff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
            }
        
            .button:hover {
              background-color: #da5555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>Hi there,</p>
            <p>We've received a request to reset your password for your account at our website.</p>
            <p>If you did not make this request, you can safely ignore this email.</p>
            <p>To reset your password, please click the link below:</p>
            <a href="${process.env.VITE_FRONTEND_URL}/reset-password?user=${userId}&token=${token}" class="button">Reset Password</a>
            <p>This link will expire in 5 minutes.</p>
            <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
            <p>Best regards,<br>
            The Example Team</p>
          </div>
        </body>
        </html>`
    };

    const response = await sendEmail(mailOptions)
    return res
        .status(200)
        .json(new ApiResponse(200, response, "Check your email"))

})

export const resetPassword = async (req, res) => {
    
       try {
         const { user, token } = req.query; // Correctly accessing req.query
         console.log(req.url);
         
         console.log('query', req.query); // Log req.query to verify inputs
 
         const { password } = req.body;
         if (!password) {
             throw new ApiError(401, "Password is required")
         }
         if (!user || !token) {
            throw new ApiError(400, "Invalid link")
         }
         const userInfo = await User.findById(user);
         console.log(userInfo.forgotPasswordToken);
         
         if (!userInfo) {
            throw new ApiError(404, "User not found")
         }
         if(!userInfo.forgotPasswordToken || !userInfo.forgotPasswordExpiry) {
             throw new ApiError(400, "Link not valid")
         }
 
         if (token === userInfo.forgotPasswordToken && userInfo.forgotPasswordExpiry > Date.now()) {
             userInfo.password = password
             userInfo.forgotPasswordToken = undefined;
             userInfo.forgotPasswordExpiry = undefined;
             await userInfo.save();
             return res
             .status(200)
             .json(new ApiResponse(200, null, "Password updated successfully"));
         } else {
            throw new ApiError(400, "Invalid token")
         }   
       } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message || 'Something went wrong'
        });
       }
};


export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getCurrentUser,
    forgotPasword,
}