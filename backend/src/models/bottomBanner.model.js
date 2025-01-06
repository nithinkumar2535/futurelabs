import mongoose, { Model, Schema } from "mongoose";



const bannerImageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

 export const bottomBannerImage = mongoose.model("BottomBannerImage", bannerImageSchema )