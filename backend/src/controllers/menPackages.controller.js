import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { MenPackages } from '../models/menPackages.model.js'
import fs from 'fs'



const addCategory = asyncHandler (async (req, res) => {
    const {name} = req.body
    const imageFile = req.file

    if ( !name || !imageFile ) {
        throw new ApiError(404, "Name and image is required")
    }

    const existingName = await MenPackages.findOne({name})
    
        if (existingName) {
            throw new ApiError(409, "Name alraedy exist")
        }

    const category = new MenPackages({
        name,
        imagePath: `uploads/${imageFile.filename}`
    })

    await category.save()

    const Category = await MenPackages.findById(category._id)

    if (!Category) {
        throw new ApiError(500, "Something went wrong while uploading less price package")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, Category, "New package is added"))

})

const updateCategory = asyncHandler( async (req, res) => {
    const {id} = req.params
    const {selected} = req.body

    const updatedCategory = await MenPackages.findByIdAndUpdate(
        id,
        {selected}, 
        {new: true}
    )
    
    return res
        .status(200)
        .json(new ApiResponse(200, updatedCategory, "Updated the selection"))
})

const getAllCategory = asyncHandler( async (req, res) => {
    const category = await MenPackages.find()

    if ( !category ) {
        throw new ApiError(500, "Something went wrong while fetching the category")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "All catogories"))
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params

    const category = await MenPackages.findById(id)

    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    fs.unlinkSync(category.imagePath);

    await MenPackages.findByIdAndDelete(id)

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Category deleted successfully"))
})

const getSelectedCategories = asyncHandler(async (req, res) => {
    const selectedCategories = await MenPackages.find({ selected: true });

    if (!selectedCategories || selectedCategories.length === 0) {
        throw new ApiError(404, "No selected categories found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, selectedCategories, "Selected categories fetched successfully"));
});


export {
    addCategory,
    updateCategory,
    getAllCategory,
    deleteCategory,
    getSelectedCategories
}