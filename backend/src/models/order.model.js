import mongoose, { Schema } from 'mongoose'


const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        quantity: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    name: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    address: {type: String, required: true},
    pincode: {type: Number, required: true},
    addressType: {type: String , default: 'Home'},
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
})

export const Order = mongoose.model("Order", orderSchema)