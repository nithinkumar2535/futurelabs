import mongoose, { Schema } from 'mongoose'


const couponSchema = new Schema({
    code: String,
    discount: Number,
    expiresAt: Date
})

export const Coupon = mongoose.model('Coupon', couponSchema)