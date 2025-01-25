import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useOutletContext } from 'react-router-dom';
import { Textarea } from "@/components/ui/textarea";

const initialFormState = {
  testName: "",
  description: "",
  includedTests: [],
  price: "",
  offerPrice: "",
  fasting: false,
  fastingTime: "",
  reportTime: "",
  category: "",
  subcategory: "",
  sampleType: "",
  tubeType: "",
  instruction: "",
  overview: "",
  risk: ""
};

function LabTests() {
  const [labTests, setLabTests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLabTestId, setCurrentLabTestId] = useState(null);
  const [sortOption, setSortOption] = useState(""); // For sorting
  const [categoryFilter, setCategoryFilter] = useState(""); // For filtering by category
  const [loading, setLoading] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormState);
  const [subcategories, setSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");





  const [singleTest, setSingleTest] = useState({ name: "", category: "" });

  const [errors, setErrors] = useState({}); // To store error messages

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/get`, { withCredentials: true });
      setLabTests(response.data.data);
      console.log(response, "fetch");
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch lab tests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") {
      setLoadingSubCategories(true); // Show loading state while fetching
      fetchSubCategories(value); // Pass the new category value to the fetch function
    }

  };

  const handleAddSingleTest = () => {
    if (!singleTest.name || !singleTest.category) {
      errors.includedTests = "Both test name and category are required.";
      return;
    }

    setFormData((prev) => {
      const existingCategoryIndex = prev.includedTests.findIndex(
        (item) => item.category === singleTest.category
      );

      if (existingCategoryIndex !== -1) {
        // Append to existing category
        const updatedTests = [...prev.includedTests];
        updatedTests[existingCategoryIndex].tests.push(singleTest.name);
        return { ...prev, includedTests: updatedTests };
      } else {
        // Create new category
        return {
          ...prev,
          includedTests: [
            ...prev.includedTests,
            { category: singleTest.category, tests: [singleTest.name] },
          ],
        };
      }
    });

    setSingleTest({ name: "", category: "" }); // Reset the form fields
  };



  const handleRemoveTest = (categoryIndex, testIndex) => {
    setFormData((prev) => {
      const updatedTests = [...prev.includedTests];
      updatedTests[categoryIndex].tests.splice(testIndex, 1);

      // Remove the category if no tests remain
      if (updatedTests[categoryIndex].tests.length === 0) {
        updatedTests.splice(categoryIndex, 1);
      }

      return { ...prev, includedTests: updatedTests };
    });
  };





  const openEditDialog = (labTest) => {


    setFormData({
      testName: labTest.testName,
      description: labTest.description,
      includedTests: labTest.includedTests,
      subcategory: "",
      price: labTest.price,
      offerPrice: labTest.offerPrice,
      fasting: labTest.fasting,
      fastingTime: labTest.fastingTime,
      reportTime: labTest.reportTime,
      sampleType: labTest.sampleType,
      tubeType: labTest.tubeType,
      instruction: labTest.instruction,
      overview: labTest.overview,
      risk: labTest.risk,
    });

    setCurrentLabTestId(labTest._id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["testName", "description", "category", "sampleType", "tubeType", "reportTime", "overview", "risk"];
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) errors[field] = `${field} is required`;
    });

    if (formData.category && subcategories.length > 0 && !formData.subcategory) {
      errors.subcategory = "Subcategory is required.";
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      errors.price = "Price must be a valid positive number.";
    }


    if (
      formData.offerPrice &&
      (isNaN(formData.offerPrice) || formData.offerPrice <= 0)
    ) {
      console.log(formData.price)
      errors.offerPrice = "Offer price must be a positive number and less than or equal to the price.";
    }

    if (formData.fasting && (!formData.fastingTime || !/^\d+-\d+$/.test(formData.fastingTime))) {
      errors.fastingTime = "Fasting time is required in the format '12-15'.";
    }

    if (!formData.reportTime || !/^\d+-\d+$/.test(formData.reportTime)) {
      errors.reportTime = "Report time is required in the format '12-15'.";
    }


    if (
      !formData.includedTests.some(
        (testGroup) => Array.isArray(testGroup.tests) && testGroup.tests.length > 0
      )
    ) {
      errors.includedTests = "At least one test must be included.";
    }


    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const url = isEditMode
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/edit/${currentLabTestId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/add`;
      const method = isEditMode ? axios.put : axios.post;

      const response = await method(url, formData, { withCredentials: true });

      if (isEditMode) {
        setLabTests((prev) =>
          prev.map((test) => (test._id === currentLabTestId ? { ...test, ...formData } : test))
        );


        toast({ title: "Success", description: "Lab test updated successfully." });
      } else {
        setLabTests((prev) => [...prev, response.data.data]);
        toast({ title: "Success", description: "Lab test added successfully." });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save lab test.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSingleTest("");
    setErrors({});
    setIsEditMode(false);
    setCurrentLabTestId(null);
  };

  const deleteLabTest = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/delete/${id}`, { withCredentials: true });
      setLabTests((prev) => prev.filter((test) => test._id !== id));
      toast({ title: "Success", description: "Lab test deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete lab test.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (category) => {

    try {
      const validCategories = [
        'lessPrice',
        'organ',
        'womenage',
        'menage',
        'men',
        'women',
        'lifestyle',
      ];
      if (validCategories.includes(category)) {

        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/category/${category}/get`, { withCredentials: true });
          console.log(response.data.data);
          setSubcategories(response.data.data);

          setLoadingSubCategories(false)
        }
        catch (error) {
          console.log(error);
          setLoading(false)
          setSubcategories([])

        }
      } else {
        setSubcategories([])
        setLoadingSubCategories(false)
      }
    } catch (error) {
      console.log(error);
      setLoadingSubCategories(false)

    }
  }

    // Handle input changes for the search query
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value); // Update search query in parent component
    };

  const applySort = (tests) => {
    if (sortOption === "priceAsc") {
      return [...tests].sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOption === "priceDesc") {
      return [...tests].sort((a, b) => b.offerPrice - a.offerPrice);
    } else if (sortOption === "name") {
      return [...tests].sort((a, b) => a.testName.localeCompare(b.testName));
    }
    return tests;
  };

  const applyFilters = (tests) => {
    if (categoryFilter) {
      return tests.filter((test) => test.category === categoryFilter);
    }
    return tests;
  };

  const sortedAndFilteredTests = applySort(applyFilters(labTests));

  // Filter products based on search query
  const searchedProducts = sortedAndFilteredTests.filter(product =>
    product.testName.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
  );




  useEffect(() => {
    fetchLabTests();
  }, []);



  return (
    


    <div className="p-6 bg-gray-50 min-h-screen">

       {/* Search Input */}
       <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full  py-2 rounded-md bg-gray-300 text-sm focus:outline-none"
          />
        </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lab Test Management</h1>

      <Button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-2"
        onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}
      >
        Add Lab Test
      </Button>

      {/* Sort and Filter Section */}
      <div className="flex gap-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border-gray-300 rounded-lg p-2"
        >
          <option value="">Sort by</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border-gray-300 rounded-lg p-2"
        >
          <option value="">All</option>
          <option value="lessPrice">Less Price & More Tests</option>
          <option value="Special Care Packages">Special Care Packages</option>
          <option value="organ">Test Based On Vital Organs</option>
          <option value="womenage">Women Age Based Packages</option>
          <option value="menage">Men Age Based Packages</option>
          <option value="women">Women Packages</option>
          <option value="men">Men Packages</option>
          <option value="lifestyle">Life Style Health Checkups</option>
          <option value="Single Test">Single Test</option>
          <option value="Exclusive">Exclusive Packages</option>
          
          
        </select>
      </div>

      {loading ? (<div className="flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
      ) : (
        searchedProducts && searchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 md:gap-10">
            {searchedProducts.map((product) => (
              <Link to={`/admin/tests/${product._id}`}>
                <div
                  key={product._id}
                  className="bg-white rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-lg border-2 border-gray-200 hover:border-green-200 p-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3 p-4">
                      <div className="flex flex-col gap-2">
                        <h1
                          className="font-bold text-black text-lg transition duration-300"
                        >
                          {product.testName}
                        </h1>
                        <span className="bg-cover bg-no-repeat bg-center bg-[url('a7a056f5.svg')] px-4 py-1 text-red-600 font-semibold text-sm">
                          {product.discountPercentage} % OFF
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 font-semibold px-4">
                      <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2">
                        Category: {product.category}
                      </span>
                      {product.subcategory && <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                        Subcategory: {product.subcategory}
                      </span>
                      }
                    </div>

                    <div className="flex justify-between items-center px-4 mt-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-green-700">
                          ₹{product.offerPrice}
                        </span>
                        <del className="text-gray-500">₹{product.price}</del>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditDialog(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteLabTest(product._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
             
            ))}
          </div>
        ) : (
          <p className="m-5 text-center text-gray-700">No tests found</p>
        )
      )}
      





      {/* Dialog for adding/editing lab test */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        <DialogContent className="overflow-y-auto max-h-[80vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? "Edit Lab Test" : "Add Lab Test"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Select Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="lessPrice">Less Price & More Tests</option>
                <option value="Special Care Packages">Special Care Packages</option>
                <option value="organ">Test Based On Vital Organs</option>
                <option value="womenage">Women Age Based Packages</option>
                <option value="menage">Men Age Based Packages</option>
                <option value="women">Women Packages</option>
                <option value="men">Men Packages</option>
                <option value="lifestyle">Life Style Health Checkups</option>
                <option value="Single Test">Single Test</option>
                <option value="Exclusive">Exclusive Packages</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Subcategory Selection */}
            {formData.category && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                  Select Subcategory
                </label>
                {loadingSubCategories ? (
                  <p className="mt-1 text-sm text-gray-500">Loading subcategories...</p>
                ) : subcategories.length > 0 ? (
                  <select
                    name="subcategory"
                    id="subcategory"
                    value={formData.subcategory}
                    className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleInputChange}
                  >
                    <option value="">Select subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No subcategories available</p>
                )}
                {errors.subcategory && <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>}
              </div>
            )}

            {/* Test Name */}
            <div>
              <label htmlFor="testName" className="block text-sm font-medium text-gray-700">
                Test Name
              </label>
              <Input
                name="testName"
                id="testName"
                value={formData.testName}
                onChange={handleInputChange}
                placeholder="Enter test name"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.testName && <p className="mt-1 text-sm text-red-600">{errors.testName}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Included Tests */}
            {/* Included Tests */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Included Tests</label>
              <div className="grid gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={singleTest.name}
                    onChange={(e) => setSingleTest({ ...singleTest, name: e.target.value })}
                    placeholder="Enter a test name"
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Input
                    value={singleTest.category}
                    onChange={(e) => setSingleTest({ ...singleTest, category: e.target.value })}
                    placeholder="Enter a heading/category"
                    className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleAddSingleTest}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add
                  </Button>
                </div>
                {errors.includedTests && <p className="mt-1 text-sm text-red-600">{errors.includedTests}</p>}


                {/* Grouped Tests */}
                <div className="mt-4 space-y-6">
                  {formData.includedTests.length > 0 ? (
                    formData.includedTests.map(({ category, tests }, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="text-lg font-bold text-gray-800">{category}</h3>
                        <ul className="mt-2 space-y-1">
                          {tests.map((test, testIndex) => (
                            <li key={testIndex} className="flex justify-between items-center">
                              <span>{test}</span>
                              <button
                                onClick={() => handleRemoveTest(categoryIndex, testIndex)}
                                className="text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tests added yet.</p>
                  )}
                </div>


              </div>
            </div>


            {/* Price and Offer Price */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <Input
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700">
                  Offer Price
                </label>
                <Input
                  name="offerPrice"
                  id="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  placeholder="Enter offer price"
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.offerPrice && <p className="mt-1 text-sm text-red-600">{errors.offerPrice}</p>}
              </div>
            </div>

            {/* Fasting */}
            <div className="flex items-center gap-2">
              <label htmlFor="fasting" className="text-sm font-medium text-gray-700">
                Fasting Required
              </label>
              <input
                type="checkbox"
                id="fasting"
                checked={formData.fasting}
                onChange={(e) => setFormData({ ...formData, fasting: e.target.checked })}
                className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            {formData.fasting && (
              <div>
                <label htmlFor="fastingTime" className="block text-sm font-medium text-gray-700">
                  Fasting Time (e.g., 12-15 hours)
                </label>
                <Input
                  name="fastingTime"
                  id="fastingTime"
                  value={formData.fastingTime}
                  onChange={handleInputChange}
                  placeholder="Enter fasting time"
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.fastingTime && <p className="mt-1 text-sm text-red-600">{errors.fastingTime}</p>}
              </div>
            )}

            {/* Sample Type and Tube Type */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="sampleType" className="block text-sm font-medium text-gray-700">
                  Sample Type
                </label>
                <Input
                  name="sampleType"
                  id="sampleType"
                  value={formData.sampleType}
                  onChange={handleInputChange}
                  placeholder="Enter sample type"
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.sampleType && <p className="mt-1 text-sm text-red-600">{errors.sampleType}</p>}
              </div>
              <div>
                <label htmlFor="tubeType" className="block text-sm font-medium text-gray-700">
                  Tube Type
                </label>
                <Input
                  name="tubeType"
                  id="tubeType"
                  value={formData.tubeType}
                  onChange={handleInputChange}
                  placeholder="Enter tube type"
                  className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tubeType && <p className="mt-1 text-sm text-red-600">{errors.tubeType}</p>}
              </div>
            </div>

            {/* Report Time */}
            <div>
              <label htmlFor="reportTime" className="block text-sm font-medium text-gray-700">
                Report Time (e.g., 12-15 hours)
              </label>
              <Input
                name="reportTime"
                id="reportTime"
                value={formData.reportTime}
                onChange={handleInputChange}
                placeholder="Enter report time"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.reportTime && <p className="mt-1 text-sm text-red-600">{errors.reportTime}</p>}
            </div>

            <div>
              <label htmlFor="instruction" className="block text-sm font-medium text-gray-700">
                Package Instruction
              </label>
              <Input
                name="instruction"
                id="instruction"
                value={formData.instruction}
                onChange={handleInputChange}
                placeholder="Enter package instruction"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

             {/* overview */}
             <div>
              <label htmlFor="overview" className="block text-sm font-medium text-gray-700">
                Overview
              </label>
              <Textarea
                name="overview"
                id="overview"
                value={formData.overview}
                onChange={handleInputChange}
                placeholder="Enter overview"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.overview && <p className="mt-1 text-sm text-red-600">{errors.overview}</p>}
            </div>

             {/* risk assessment */}
             <div>
              <label htmlFor="risk" className="block text-sm font-medium text-gray-700">
                Risk Assessment
              </label>
              <Textarea
                name="risk"
                id="risk"
                value={formData.risk}
                onChange={handleInputChange}
                placeholder="Enter risk assessment"
                className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.risk && <p className="mt-1 text-sm text-red-600">{errors.risk}</p>}
            </div>
          </div>

          {loading ? (<DialogFooter className="mt-6 flex justify-end gap-4">
            <Button onClick={handleSubmit} disabled className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Saving
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled
            >
              Cancel
            </Button>
          </DialogFooter>) : (<DialogFooter className="mt-6 flex justify-end gap-4">
            <Button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save
            </Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </Button>
          </DialogFooter>)}

        </DialogContent>
      </Dialog>

    </div>
  );
}

export default LabTests;
