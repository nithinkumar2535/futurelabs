import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { phoneUser } from '../models/phoneAuth.model.js';


export const verifyPhoneJWT = asyncHandler( async (req, _, next) => {
    
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(400, "Unauthorized")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await phoneUser.findById(decodedToken?._id).select("-refreshToken");

        if (!user) {
            throw new ApiError(400, "Unauthorized")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
})