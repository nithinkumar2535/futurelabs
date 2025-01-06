import { mainBannerImage } from "../models/mainBanner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import fs from 'fs'




const uploadMainBanner = asyncHandler(async (req, res) => {

    const {title, category, test} = req.body
    const imageFile = req.file;

    console.log(req.body);
    
    
    if (!title || !imageFile || !category || !test) {
        throw new ApiError(400, "All fields are required")
    }

    const mainBanner = new mainBannerImage({
        title,
        imageUrl: `uploads/${imageFile.filename}`,
        category,
        test,
    })

    await mainBanner.save()

    const banner = await mainBannerImage.findById(mainBanner._id);

    if (! banner) {
        throw new ApiError(500, "Something went wrong while uploading banner")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, banner, "Banner image uploaded successfully"))
})


// Get all banners

const getMainBanners = asyncHandler ( async (req,res) => {
    const banners = await mainBannerImage.find();
    
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

const deleteMainBanner = asyncHandler(async (req, res) => {
    const { id } = req.params

    const banner = await mainBannerImage.findById(id);

    if (!banner) {
        throw new ApiError(404, "Banner not found");
    }

    fs.unlinkSync(banner.imageUrl);

    await mainBannerImage.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, null, "Banner deleted successfully"));
});

export {
    uploadMainBanner,
    deleteMainBanner,
    getMainBanners
}