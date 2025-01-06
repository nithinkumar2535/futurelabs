import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useOutletContext } from 'react-router-dom';
import { Textarea } from "@/components/ui/textarea";

function LabTests({ searchResults }) {
  const [labTests, setLabTests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLabTestId, setCurrentLabTestId] = useState(null);
  const [sortOption, setSortOption] = useState(""); // For sorting
  const [categoryFilter, setCategoryFilter] = useState(""); // For filtering by category
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useOutletContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    includedTests: [],
    price: "",
    offerPrice: "",
    fasting: false,
    fastingTime: "",
    reportTime: "",
    category: "",
    sampleType: "",
    tubeType: "",
    recommended: "",
  });

  const [singleTest, setSingleTest] = useState("");
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

  const addOrEditLabTest = async () => {
    // Validate form data before submission
    if (!validateForm()) {
      return; // If validation fails, prevent form submission
    }

    try {
      setLoading(true);
      if (isEditMode) {
        // Update lab test
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/edit/${currentLabTestId}`,
          formData,
          { withCredentials: true }
        );


        setLabTests((prevTests) =>
          prevTests.map((test) =>
            test._id === currentLabTestId ? { ...test, ...formData } : test
          )
        );

        toast({ title: "Success", description: "Lab test updated successfully." });
      } else {
        // Add new lab test
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/add`,
          formData,
          { withCredentials: true }
        );
        console.log(formData);

        setLabTests((prev) => [...prev, response.data.data]);
        toast({ title: "Success", description: "Lab test added successfully." });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save lab test.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSingleTest = () => {
    if (singleTest.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      includedTests: [...prev.includedTests, singleTest],
    }));
    setSingleTest("");
  };

  const handleRemoveTest = (index) => {
    setFormData((prev) => ({
      ...prev,
      includedTests: prev.includedTests.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      testName: "",
      description: "",
      includedTests: [],
      price: "",
      offerPrice: "",
      fasting: false,
      fastingTime: "",
      reportTime: "",
      category: "",
      tubeType: "",
      sampleType: "",
      recommended: false,

    });
    setSingleTest("");
    setIsEditMode(false);
    setCurrentLabTestId(null);
    setErrors({}); // Reset error messages
  };

  const openEditDialog = (labTest) => {
    setFormData({
      testName: labTest.testName,
      description: labTest.description,
      includedTests: labTest.includedTests,
      price: labTest.price,
      offerPrice: labTest.offerPrice,
      fasting: labTest.fasting,
      fastingTime: labTest.fastingTime,
      reportTime: labTest.reportTime,
      sampleType: labTest.sampleType,
      tubeType: labTest.tubeType,
      recommended: labTest.recommended
    });
    setCurrentLabTestId(labTest._id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};


    const price = String(formData.price).trim();
    const offerPrice = String(formData.offerPrice).trim();


    // Check if any required field is empty
    if (!formData.testName.trim()) newErrors.testName = 'Test name is required';
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.category) newErrors.category = "Please select a category"
    if (formData.fasting === true && !formData.fastingTime) newErrors.fastingTime = "Please enter fasting time"
    if (!formData.sampleType) newErrors.sampleType = "Sample type is required"
    if (!formData.tubeType) newErrors.tubeType = "Tube type is required"
    if (!price || isNaN(Number(price))) newErrors.price = 'Please enter a valid price';
    if (!offerPrice || isNaN(Number(offerPrice))) newErrors.offerPrice = 'Please enter a valid offer price';
    if (!errors.reportTime) newErrors.reportTime = "Report time is required"



    // Check for invalid includedTests values
    if (formData.includedTests.length === 0) newErrors.includedTests = 'At least one test must be included';

    setErrors(newErrors);

    // If there are any errors, return false to prevent form submission
    return Object.keys(newErrors).length === 0;
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
          <option value="Full Body Checkup">Full Body Checkup</option>
          <option value="Heart Health">Heart Health</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Gym Profile">Gym Profile</option>
          <option value="Pregnancy">Pregnancy</option>
          <option value="Fever">Fever</option>
          <option value="Cancer Screening">Cancer Screening</option>
          <option value="Women">Women</option>
          <option value="Yoga Profile">Yoga Profile</option>
          <option value="STD">STD</option>
          <option value="Thyrroid">Thyrroid</option>
          <option value="Hair & Skin">Hair & Skin</option>
          <option value="Allergy Test">Allergy Test</option>
          <option value="Vitamin">Vitamin</option>
          <option value="Fertility Profile">Fertility Profile</option>
        </select>
      </div>


      {searchedProducts && searchedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 md:gap-10">
          {searchedProducts.map((product) => (
            <div
              key={product._id}
              className="w-fit bg-gray-100 rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-md border-2 border-gray-100 hover:bg-gradient-to-br hover:from-green-200 hover:via-gray-100 hover:to-white hover:border-green-100 p-2"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-3 p-4">
                  <div className="flex flex-col gap-2">
                    <a
                      href={product.link}
                      className="font-bold text-black text-lg"
                    >
                      {product.testName}
                    </a>
                    <span className="bg-cover bg-no-repeat bg-center bg-[url('a7a056f5.svg')] px-4 py-1 text-red-600 font-semibold text-sm">
                      {product.discountPercentage} % OFF
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center px-4">
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
          ))}
        </div>
      ) : (
        <p className="m-5">No products found</p>
      )}



      {/* Dialog for adding/editing lab test */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        <DialogContent className="overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Lab Test" : "Add Lab Test"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
          <div>
              <select
                name="category"
                id="category"
                value={formData.category}
                className="border-gray-300 rounded-lg"
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="Full Body Checkup">Less Price & More Tests</option>
                <option value="Heart Health"></option>
                <option value="Diabetes">Diabetes</option>
              
              </select>
              {errors.category && <p className="text-red-600">{errors.category}</p>}
            </div>
            <Input
              name="testName"
              value={formData.testName}
              onChange={handleInputChange}
              placeholder="Enter test name"
              className="border-gray-300 rounded-lg"
            />
            {errors.testName && <p className="text-red-600">{errors.testName}</p>}

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              className="border-gray-300 rounded-lg"
            />
            {errors.description && <p className="text-red-600">{errors.description}</p>}

           

            <div>
              <Input
                value={singleTest}
                onChange={(e) => setSingleTest(e.target.value)}
                placeholder="Enter an included test"
                className="border-gray-300 rounded-lg"
              />
              <Button
                onClick={handleAddSingleTest}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Add Test
              </Button>
              {errors.includedTests && <p className="text-sm text-red-500">{errors.includedTests}</p>}
              <ul className="mt-2">
                {formData.includedTests.map((test, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {test}
                    <button
                      onClick={() => handleRemoveTest(index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Input
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="border-gray-300 rounded-lg"
            />
            {errors.price && <p className="text-red-600">{errors.price}</p>}

            <Input
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleInputChange}
              placeholder="Enter offer price"
              className="border-gray-300 rounded-lg"
            />
            {errors.offerPrice && <p className="text-red-600">{errors.offerPrice}</p>}

            <div>
              <label className="text-sm font-medium">Fasting</label>
              <input
                type="checkbox"
                checked={formData.fasting}
                onChange={(e) => setFormData({ ...formData, fasting: e.target.checked })}
                className="ml-2"
              />
            </div>

            {
              formData.fasting === true &&
              <Input
                name="fastingTime"
                value={formData.fastingTime}
                onChange={handleInputChange}
                placeholder="Enter fasting time (eg. 12-15)"
                className="border-gray-300 rounded-lg"
              />
            }
            {errors.fastingTime && <p className="text-red-600">{errors.fastingTime}</p>}

            <Input
              name="sampleType"
              value={formData.sampleType}
              onChange={handleInputChange}
              placeholder="Enter sample type "
              className="border-gray-300 rounded-lg"
            />
            {errors.sampleType && <p className="text-red-600">{errors.sampleType}</p>}

            <Input
              name="tubeType"
              value={formData.tubeType}
              onChange={handleInputChange}
              placeholder="Enter offer tube type"
              className="border-gray-300 rounded-lg"
            />
            {errors.tubeType && <p className="text-red-600">{errors.tubeType}</p>}

            <Input
              name="reportTime"
              value={formData.reportTime}
              onChange={handleInputChange}
              placeholder="Enter report time (eg. 12-15)"
              className="border-gray-300 rounded-lg"
            />
            {errors.reportTime && <p className="text-red-600">{errors.reportTime}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Recommended</label>
            <input
              type="checkbox"
              checked={formData.recommended}
              onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
              className="ml-2"
            />
          </div>

          <DialogFooter>
            <Button onClick={addOrEditLabTest} className="bg-blue-600 text-white">Save</Button>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              className="bg-gray-500 text-white"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LabTests;
