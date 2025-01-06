import mongoose, { Schema } from "mongoose";


const testSchema = new Schema({
    testName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String
    },
    includedTests: [
        {
          category: { type: String, required: true },
          tests: {type: [String], required: true }
        }
      ],
    price: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number
    },
    discountPercentage: {
        type: Number
    },
    fasting: {
        type: Boolean,
    },
    fastingTime:{
        type: String
    },
    reportTime: {
        type: String
    },
    sampleType: {
        type: String
    },
    tubeType: {
        type: String
    },
    totalTests: {
        type:Number
    },
    selected: {
        type: Boolean,
        default: false
    },
    instruction:{
        type:String
    },
    overview:{
        type:String
    },
    risk:{
        type:String
    }
},
{
    timestamps: true
})

export const TestModel = mongoose.model("Test", testSchema)