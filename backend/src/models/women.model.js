import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema({
    name : String,
    imagePath: String,
    selected: {
        type: Boolean,
        default: false
    }
})

export const WomenPackages = mongoose.model('Women packages', categorySchema)