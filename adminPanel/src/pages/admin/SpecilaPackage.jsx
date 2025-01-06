import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

function SpecialPackages() {

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const { toast } = useToast();

 

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/Special Care Packages`, { withCredentials: true });
      setTests(response.data.data);
      console.log(response.data);

    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch tests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

 

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/delete/${id}`, { withCredentials: true });
      setTests((prev) => prev.filter((categories) => categories._id !== id));
      toast({ title: "Success", description: "Category deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete Category.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };



 

  const toggleTestSelection = async (id, currentState) => {
    try {
      const selectedCount = tests.filter((test) => test.selected).length;

      // Prevent selection if more than six are already selected
      if (!currentState && selectedCount >= 6) {
        toast({
          title: "Limit Reached",
          description: "You can only select up to six categories.",
          variant: "warning",
        });
        return;
      }

      setTogglingId(id); 
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/update/${id}`,
        { selected: !currentState },
        { withCredentials: true }
      );
      console.log(response);

      setTests((prev) =>
        prev.map((test) =>
          test._id === id ? { ...test, selected: response.data.data.selected } : test
        )
      );

      toast({ title: "Success", description: "Package selection for displaying front page updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update Package selection.", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
<div className="p-6 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
  <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
    Special Care Packages
  </h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {tests.map((test) => (
      <div
        key={test._id}
        className="relative w-full max-w-xs bg-white border-2 border-[#007c6f] rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:scale-105 flex flex-col m-auto"
      >
        {/* Title */}
        <h2 className="text-center font-extrabold text-lg text-black px-4 py-5 border-b-2 border-gray-100 line-clamp-2 h-[120px] overflow-hidden">
          {test.testName}
        </h2>

        {/* Price and Discount Info */}
        <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-green-50 to-gray-50">
          <span className="text-green-600 font-semibold text-lg">
            {test.discountPercentage}% OFF
          </span>
          <div className="text-right">
            <del className="block text-gray-400 text-sm">{test.price}</del>
            <span className="text-gray-800 font-bold text-lg">
              {test.offerPrice}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 px-5 py-4 bg-gray-50 mt-auto">
          {/* Delete Button */}
          <button
            onClick={() => deleteCategory(test._id)}
            className="flex-1 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-400 transition-colors"
          >
            Delete
          </button>

          {/* Select/Deselect Button */}
          <button
            onClick={() =>
              toggleTestSelection(test._id, test.selected || false)
            }
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              test.selected
                ? "bg-yellow-400 text-gray-800 hover:bg-yellow-300"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            disabled={togglingId === test._id}
          >
            {togglingId === test._id ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C4.477 0 0 4.477 0 10h4z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : test.selected ? (
              "Deselect"
            ) : (
              "Select"
            )}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


  );
};





export default SpecialPackages
