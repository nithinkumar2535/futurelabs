import mongoose, { Schema } from 'mongoose'


const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        quantity: { type: Number, required: true },
    }],
    totalPayable: { type: Number, required: true },
    cartValue: { type: Number, required: true },
    discountedValue: { type: Number, required: true },
    couponDiscount: { type: Number, required: true },
    exclusiveDiscount: { type: Number, required: true },
    name: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    address: {type: String, required: true},
    pincode: {type: Number, required: true},
    addressType: {type: String , default: 'Home'},
    couponCode: { type: String, default: null },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
})

export const Order = mongoose.model("Order", orderSchema)