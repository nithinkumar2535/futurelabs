import { TestModel } from "../models/test.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const addTest = asyncHandler (async (req, res) => {
    const { testName, description, category, subcategory, includedTests, price, offerPrice, fasting, fastingTime, reportTime, sampleType, tubeType, instruction, overview, risk} = req.body;
console.log(req.body);

    const discountPercentage = price? ((price-offerPrice) / price) * 100 : 0
    const totalTests = includedTests.reduce((sum, testGroup) => sum + testGroup.tests.length, 0);
    
    const newTest = new TestModel({
        testName,
        description,
        category,
        subcategory,
        includedTests,
        price,
        offerPrice,
        discountPercentage: discountPercentage.toFixed(0),
        fasting,
        fastingTime,
        reportTime,
        sampleType,
        tubeType,
        totalTests,
        instruction,
        overview,
        risk
    })
    await newTest.save()

    const test = await TestModel.findById(newTest._id)
    
    
    if(!test) {
        throw new ApiError(500, "Something went wrong while adding test")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, test, "Test added successfully"))
})

const fechAllTests = asyncHandler( async(req, res) => {
    const listOfTests = await TestModel.find();

    if(! listOfTests) {
        throw new ApiError(500, "Something went wrong while fetching the tests")
    }

    const category = req.query.category
    let filteredTest = listOfTests
    if(category) {
        filteredTest = listOfTests.filter(test => test.category === category)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, filteredTest, "All tests"))
})

const editTest = asyncHandler(async(req, res) => {
    const { id } = req.params
    const { testName, description, category, subcategory, includedTests, price, offerPrice, fasting, fastingTime, reportTime,sampleType, tubeType, instruction, overview, risk} = req.body;
    
    //check if the test exists

    const test = await TestModel.findById(id)
    
    if(!test) {
        throw new ApiError(404, "Test not found")
    }
    
    test.testName = testName !== undefined && testName !== null ? testName : test.testName;
    test.description = description !== undefined && description !== null ? description : test.description;
    test.category = category !== undefined && category !== null ? category: test.category;
    test.subcategory =  subcategory
    test.includedTests = includedTests !== undefined && includedTests !== null ? includedTests : test.includedTests;
    test.price = price !== undefined && price !== null ? price : test.price;
    test.offerPrice = offerPrice !== undefined && offerPrice !== null ? offerPrice : test.offerPrice;
    test.fasting = fasting !== undefined && fasting !== null ? fasting : test.fasting;
    test.fastingTime = fastingTime !== undefined && fastingTime !== null ? fastingTime : test.fastingTime;
    test.reportTime = reportTime !== undefined && reportTime !== null ? reportTime : test.reportTime;
    test.sampleType = sampleType !== undefined && sampleType !== null ? sampleType : test.sampleType;
    test.tubeType = tubeType !== undefined && tubeType !== null ? tubeType : test.tubeType;
    test.instruction = instruction !== undefined && instruction !== null ? instruction : test.instruction;
    test.overview = overview !== undefined && overview !== null ? overview : test.overview;
    test.risk = risk !== undefined && risk !== null ? risk : test.risk;
    if (price !== undefined || offerPrice !== undefined) {
        const discountPercentage = ((test.price - test.offerPrice) / test.price) * 100;
        test.discountPercentage = discountPercentage.toFixed(0); // Recalculate the discount
    }
    if (includedTests !== undefined && includedTests !== null) {
        const totalTests = includedTests.reduce((sum, testGroup) => sum + testGroup.tests.length, 0);
        test.totalTests = totalTests;
    }
   

    

    await test.save()
    return res
        .status(200)
        .json (new ApiResponse (200, test, "Test updated successfully"))
})

const deleteTest = asyncHandler (async (req, res) => {
    const { id } = req.params

    const test = await TestModel.findById(id)

    if(!test) {
        throw new ApiError(404, "Test not found")
    }

    await TestModel.findByIdAndDelete(id)

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Test deleted successfully"))
})


const getTestsByCategoryAndSubcategory = asyncHandler(async (req, res) => {
    const { category, subcategory } = req.params;

    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    // Query the database
    const tests = await TestModel.find({
        category,
        subcategory
    });

    if (!tests || tests.length === 0) {
        throw new ApiError(404, "No tests found for the given category and subcategory");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tests, "Tests fetched successfully"));
});


const updateSelection = asyncHandler( async (req, res) => {
    const { id } = req.params
    const {selected} = req.body

    const updatedTest = await TestModel.findByIdAndUpdate(
        id,
        {selected},
        {new: true}
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTest, "Updated the test successfully"))
})

const getTestsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    // Query the database
    const tests = await TestModel.find({
        category
    });

    if (!tests || tests.length === 0) {
        throw new ApiError(404, "No tests found for the given category and subcategory");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tests, "Tests fetched successfully"));
});

const getSelectedPackages = asyncHandler(async (req, res) => {

    const { category } = req.params

    if (!category) {
        throw new ApiError(404, "Category is required")
    }
   

    const selectedPackages = await TestModel.find({ category,selected: true });

    if (!selectedPackages || selectedPackages.length === 0) {
        throw new ApiError(404, "No selected categories found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, selectedPackages, "Selected categories fetched successfully"));
});

const getTestsById = asyncHandler (async (req, res) => {
    const {id}  = req.params;

    if(!id) {
        throw new ApiError(400, "Id is required")
    }

    const test = await TestModel.findById(id)

    return res
        .status(200)
        .json(new ApiResponse(200, test, "test"))
})

const getRandomSixTestsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    
    

    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    // Query the database to get six random tests from the given category
    const tests = await TestModel.aggregate([
        { $match: { category } }, // Filter by category
        { $sample: { size: 6 } }  // Randomly select 6 documents
    ]);

    if (!tests || tests.length === 0) {
        throw new ApiError(404, "No tests found for the given category");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tests, "Tests fetched successfully"));
});








export {
    addTest,
    fechAllTests,
    editTest,
    deleteTest,
    getTestsByCategoryAndSubcategory,
    updateSelection,
    getTestsByCategory,
    getSelectedPackages,
    getTestsById,
    getRandomSixTestsByCategory
}