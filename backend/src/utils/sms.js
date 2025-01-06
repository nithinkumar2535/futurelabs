import { asyncHandler } from "./asyncHandler.js";
import { ApiResponse } from "./ApiResponse.js";
import axios from "axios";



const sendSMS = asyncHandler(async (otp, phone) => {

    const message = `Your OTP is ${otp}. Please do not share with anyone`;
    const apiUrl = process.env.SMS_API_URL
    const userName = process.env.SMS_API_USERNAME
    const pass = process.env.SMS_API_PASS
    const sender= process.env.SMS_API_SENDER

    try {
        const response = await axios.post(`${apiUrl}?user=${userName}&pass=${pass}&sender=${sender}&phone=${phone}&text=api%20test%20-%20BHASHSMS&priority=ndnd&stype=normal`,
        );
        
    } catch (error) {
        console.error(error)
    }
})

export default sendSMS