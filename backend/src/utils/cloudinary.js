import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { ApiError } from "./ApiError.js";
import dotenv from 'dotenv'


dotenv.config()
 // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
      api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null
            const response = await cloudinary.uploader.upload(
                localFilePath, {
                    resource_type: "auto"
                }
            )    
            console.log("File uploaded on cloudinary. File src: " + response.url);

            // delete file from our servers

           if (fs.existsSync(localFilePath)) {
             fs.unlinkSync(localFilePath); // Delete the file even if upload fails
           }
            return response
            
        } catch (error) {
            console.log("Error on cloudinary ", error);
            
           if (fs.existsSync(localFilePath)) {
             fs.unlinkSync(localFilePath); // Delete the file even if upload fails
           }
            return null
        }
    }

    export {uploadOnCloudinary}