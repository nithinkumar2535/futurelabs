import { Prescription } from "../models/prescription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";
import fs from 'fs'




const uploadPrescription = asyncHandler(async (req, res) => {
    const {whatsapp} = req.body 
    const file = req.file

    if ( !whatsapp || !file ) {
        throw new ApiError(404, "Whatsapp number and prescription is required")
    }
    
    const filePath =  `uploads/${file.filename}`
    console.log(filePath);
    

   

    const prescription = new Prescription({
        whatsapp,
        imagePath: filePath
    })
    await prescription.save()

    
    

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN,
        subject: 'New prescription uploaded',
        text: `Whatsapp number: ${whatsapp}`,
        attachments: [
            {
                filename: file.originalname,
                path: filePath
            }
        ]
       
    };

    try {
        const response = await sendEmail(mailOptions);
        console.log('Email sent:');

        return res.status(200).json(new ApiResponse(200, null, "Prescription sent to the mail"));
    } catch (err) {
        console.error('Error sending email:');
        throw new ApiError(500, "Failed to send email");
    }
})

const deletePrescription = asyncHandler(async (req, res) => {
    const {id} = req.params

    const prescription = await Prescription.findById(id)

    if (!prescription) {
        throw new ApiError(404, "Prescription not found ")
    }

    fs.unlinkSync(prescription.imagePath);

    await Prescription.findByIdAndDelete(id);

    return res
        .status(200)
        .json( new ApiResponse (200, null, "Prescription deleted successfully"))

})

const fetchPrescription = asyncHandler (async (req, res) =>{
    const prescriptions = await Prescription.find()
    console.log(prescriptions);
    

    if ( !prescriptions) {
        throw new ApiError(404, "Something went wrong while fetching the prescriptions")
    }

    return res
        .status(200)
        .json( new ApiResponse (200, prescriptions, "All prescription"))
})



export {
    uploadPrescription,
    deletePrescription,
    fetchPrescription
}