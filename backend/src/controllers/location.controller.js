import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from 'axios'


const getCurrentLocation = asyncHandler( async (req, res) => {
    const { latitude, longitude} = req.body

    if(!latitude || !longitude) {
        throw new ApiError(400, "Latitude and Longitude is required")
    }

    const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
      );
      console.log(response.data);
      
      return res
        .status(200)
        .json(new ApiResponse(200, response.data.address, "success"))
})

const getPincode = asyncHandler( async (req, res) => {
    const { pincode } = req.params
     
    
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
        throw new ApiError(400, "A valid 6-digit pincode is required");
      }
    

    const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_API_KEY}&q=${pincode}&format=json`
      );
    console.log("response", response.data);

    return res
        .status(200)
        .json(new ApiResponse(200, response.data, "Success"))
    
})

export {
    getPincode,
    getCurrentLocation
}