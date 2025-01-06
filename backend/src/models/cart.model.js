import mongoose, { Schema } from 'mongoose'


const cartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: Number,
        required: true
    }
})

export const Cart = mongoose.model("Cart", cartSchema)