import mongoose, { Schema } from 'mongoose'


const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
}, {timestamps: true})

export const Cart = mongoose.model("Cart", cartSchema)