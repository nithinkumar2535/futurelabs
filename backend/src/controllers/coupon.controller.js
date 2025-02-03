import { asyncHandler } from "../utils/asyncHandler.js";
import { Coupon } from "../models/coupon.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const addCoupon = asyncHandler (async (req, res) => {
    const { code, discount, expiresAt } = req.body;
    
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
        throw new ApiError(404, "Coupon already exist")
    }

    const newCoupon = new Coupon({ code, discount, expiresAt });
    await newCoupon.save();
    return res
        .status(200)
        .json (new ApiResponse(200, newCoupon, "Coupon added successfully"))
})

const fetchCoupon = asyncHandler (async (req, res) => {
    
    const coupons = await Coupon.find();
    
    if (!coupons) {
        throw new ApiError(404, "coupons not found")
    }

   
    return res
        .status(200)
        .json (new ApiResponse(200, coupons, ""))
})

const deleteCoupon = asyncHandler (async (req, res) => {

    const { id } = req.params

    if (!id) {
        throw new ApiError(404, "coupons id not found")
    }

    await Coupon.findByIdAndDelete(id);

    return res
        .status(200)
        .json (new ApiResponse(200, null, "Coupon deleted successfully"))
})

const validateCoupon = asyncHandler (async (req, res) => {

    const { code } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
        throw new ApiError(404, "Invalid coupon")
    }

    if (coupon.expiresAt < new Date()) {
        throw new ApiError(400, "Coupon expired")
    }

    return res
        .status(200)
        .json (new ApiResponse(200, coupon, "Coupon applied successfully"))
})


export {
    addCoupon,
    deleteCoupon,
    fetchCoupon,
    validateCoupon
}