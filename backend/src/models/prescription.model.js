import mongoose, { Schema } from 'mongoose'


const prescriptionSchema = new Schema({
    whatsapp: String,
    imagePath: String,
    uploadedAt: {
        type: Date,
        default: Date.now()
    }
})

export const Prescription = mongoose.model("Prescription", prescriptionSchema)