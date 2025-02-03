import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function MenAge() {

  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    imageFile: null,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/category/menage/get`, { withCredentials: true });
      setCategories(response.data.data);
      console.log(response.data);

    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch categories.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("imageFile", formData.imageFile);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/category/menage/upload`,
        formDataToSend, { withCredentials: true },
        { headers: { "Content-Type": "multipart/form-data" } },

      );
      setCategories((prev) => [...prev, response.data.data]);
      toast({ title: "Success", description: "Category added successfully." });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.log(error.status);
      if (error.status === 409) {
        toast({ title: "Error", description: "Name already exist", variant: "destructive" });
      }else {
        toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {

    if (categories.length === 1) {
      toast({ title: "Error", description: "At least one category must remain.", variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/category/menage/delete/${id}`, { withCredentials: true });
      setCategories((prev) => prev.filter((category) => category._id !== id));
      toast({ title: "Success", description: "Category deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const resetForm = () => {
    setFormData({ name: "", imageFile: null });
  };

  const toggleCategorySelection = async (id, currentState) => {
    try {
      const selectedCount = categories.filter((category) => category.selected).length;

       // Prevent deselecting the last selected category
       if (currentState && selectedCount === 1) {
        toast({
          title: "Action Not Allowed",
          description: "At least one category must remain selected.",
          variant: "warning",
        });
        return;
      }

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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/category/menage/update/${id}`,
        { selected: !currentState },
        { withCredentials: true }
      );
      console.log(response);

      setCategories((prev) =>
        prev.map((category) =>
          category._id === id ? { ...category, selected: response.data.data.selected } : category
        )
      );

      toast({ title: "Success", description: "Category selection for displaying front page updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update category selection.", variant: "destructive" });
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Men Age Categories</h1>

      <Button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={() => setIsDialogOpen(true)}
      >
        Add Category
      </Button>

      <div className="container mx-auto">


        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <div key={index} className="flex justify-center">

                <div className="bg-teal-50 p-4 rounded-lg shadow-lg hover:shadow-xl hover:border-teal-400 border-transparent border-2 transition duration-300">
                  <div className="text-center">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/${item.imagePath}`}
                      alt={item.name}
                      className="mx-auto w-40"
                    />
                    <h4 className="font-semibold text-base md:text-lg lg:text-xl mt-2 text-gray-800">
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex space-x-2 mt-2"> {/* Adjusted space between buttons */}
            <button
              onClick={() => deleteCategory(item._id)}
              className="bg-red-500 text-white text-sm md:text-base px-3 py-2 rounded-lg hover:bg-red-400 w-auto"
            >
              Delete
            </button>
            <button
              onClick={() => toggleCategorySelection(item._id, item.selected || false)}
              className={`px-3 py-2 rounded-lg text-sm md:text-base w-auto ${item.selected ? "bg-yellow-400 text-gray-800" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              disabled={togglingId === item._id} // Disable button while toggling
            >
              {togglingId === item._id ? (
                <span className="flex items-center">
                  <span className="loader mr-2"></span> {/* Add a CSS-based spinner */}
                  Updating...
                </span>
              ) : item.selected ? (
                "Deselect"
              ) : (
                "Select"
              )}
            </button>
          </div>
                 

                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No packages found</p>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">Add Category</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCategory();
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
                  Categoty Name
                </label>
                <Input
                  id="altText"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <Input
                  id="image"
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              {/*  <p className="text-red-600">The file size should be 1200 * 450 pixel</p> */}
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};





export default MenAge
