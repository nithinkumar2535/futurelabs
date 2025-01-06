import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema({
    name : {
        type: String,
        unique: true
    },
    imagePath: String,
    selected: {
        type: Boolean,
        default: false
    }
})

export const LessPricePackages = mongoose.model('Less price packages', categorySchema)