import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema({
    name : String,
    imagePath: String,
    selected: {
        type: Boolean,
        default: false
    }
})

export const OrganTests = mongoose.model('Organ tests', categorySchema)