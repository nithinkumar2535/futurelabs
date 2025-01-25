import { bottomBannerImage } from "../models/bottomBanner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url";



const uploadBottomBanner = asyncHandler(async (req, res) => {

    const title = req.body.title
    const imageFile = req.file;
    
    if (!title || !imageFile) {
        throw new ApiError(400, "Title and image is required")
    }

    const bottomBanner = new bottomBannerImage({
        title,
        imageUrl: `uploads/${imageFile.filename}`
    })

    await bottomBanner.save()

    const banner = await bottomBannerImage.findById(bottomBanner._id);

    if (! banner) {
        throw new ApiError(500, "Something went wrong while uploading banner")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, bottomBanner, "Banner image uploaded successfully"))
})


// Get all banners

const getBottomBanners = asyncHandler ( async (req,res) => {
    const banners = await bottomBannerImage.find();
    
    if( ! banners) {
        throw new ApiError(500, "Something went wrong while fetching the banner")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, banners, "All banners")
        )
})




//Delete a banner 

const deleteBottomBanner = asyncHandler(async (req, res) => {
    const {id} = req.params

    const banner = await bottomBannerImage.findById(id);

    if (!banner) {
        throw new ApiError(404, "Banner not found");
    }

    fs.unlinkSync(banner.imageUrl)

    await bottomBannerImage.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, null, "Banner deleted successfully"));
});

// Get a random banner
const getRandomBottomBanner = asyncHandler(async (req, res) => {
    const count = await bottomBannerImage.countDocuments();
    
    if (count === 0) {
        throw new ApiError(404, "No banners found");
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomBanner = await bottomBannerImage.findOne().skip(randomIndex);

    if (!randomBanner) {
        throw new ApiError(500, "Something went wrong while fetching the banner");
    }

    return res.status(200).json(new ApiResponse(200, randomBanner, "Random banner fetched successfully"));
});

export {
    uploadBottomBanner,
    deleteBottomBanner,
    getBottomBanners,
    getRandomBottomBanner
};



