import { asyncHandler } from "./asyncHandler.js";

import axios from "axios";



const sendSMS = asyncHandler(async (otp, phone) => {

    const message = `Your OTP for verification is ${otp}. Please do not share this code with anyone`;
    const apiUrl = process.env.SMS_API_URL
    const userName = process.env.SMS_API_USERNAME
    const pass = process.env.SMS_API_PASS
    const sender= process.env.SMS_API_SENDER

    try {
        const response = await axios.post(`${apiUrl}?user=${userName}&pass=${pass}&sender=${sender}&phone=${phone}&text=Your%20OTP%20for%20verification%20is%20${otp}.%20Please%20do%20not%20share%20this%20code%20with%20anyone%20-%20FUTURE%20LABS%20DIAGNOSTICS&priority=ndnd&stype=normal`,
        );
        console.log("otp send");
        
        
    } catch (error) {
        console.error(error)
    }
})

export default sendSMS
