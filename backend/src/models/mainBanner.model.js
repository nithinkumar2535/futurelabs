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
    category: {
        type: String,
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Test',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

 export const mainBannerImage = mongoose.model("MainBannerImage", bannerImageSchema )