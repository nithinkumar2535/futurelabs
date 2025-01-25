import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

function MainBanner() {
  const [mainBanner, setMainBanners] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [tests, setTests] = useState([])
  const [errors, setErrors] = useState({});
  const [loadingTests, setLoadingTests] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: null,
    category: "",
    test: ""
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/mainbanners/get`, { withCredentials: true });
      setMainBanners(response.data.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch mainBanner.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async (category) => {

    try {
      
      if (category) {

        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/${category}`);
          console.log(response.data.data);
          setTests(response.data.data);

          setLoadingTests(false)
        }
        catch (error) {
          console.log(error);
          setLoading(false)
          setTests([])

        }
      } else {
        setTests([])
        setLoadingTests(false)
      }
    } catch (error) {
      console.log(error);
      setLoadingTests(false)

    }
  }

  
  const addBanner = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("imageUrl", formData.imageUrl);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("test", formData.test);


    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/mainbanners/add`,
        formDataToSend, { withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" } },

      );
      setMainBanners((prev) => [...prev, response.data.data]);
      toast({ title: "Success", description: "Banner added successfully." });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add banner.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/mainbanners/delete/${id}`, { withCredentials: true });
      setMainBanners((prev) => prev.filter((banner) => banner._id !== id));
      toast({ title: "Success", description: "Banner deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete banner.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "category") {
      setLoadingTests(true); // Show loading state while fetching
      fetchTests(value); // Pass the new category value to the fetch function
    }

  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageUrl: e.target.files[0] }));
  };

  const resetForm = () => {
    setFormData({ title: "", imageUrl: null });
  };

  const trimName = (name, length) => {
    return name.length > length ? `${name.substring(0, length)}...` : name;
  };

  useEffect(() => {
    fetchBanners();

  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Main Banner Management</h1>

      <Button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={() => setIsDialogOpen(true)}
      >
        Add Main Banner
      </Button>

      <Table className="mt-6 w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="font-semibold text-gray-600 ">Image</TableCell>
            <TableCell className="font-semibold text-gray-600">Title</TableCell>
            <TableCell className="font-semibold text-gray-600">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mainBanner && mainBanner.length > 0 ? (
            mainBanner.map((banner) => (
              <TableRow key={banner._id} className="hover:bg-gray-50">
                <TableCell>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${banner.imageUrl}`}
                    alt={banner.title}
                    className="h-20 w-40 object-cover rounded-lg border border-gray-300"
                  />
                </TableCell>
                <TableCell className="text-gray-800">{banner.title}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={() => deleteBanner(banner._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="3" className="text-center text-gray-500">
                No banners found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">Add New Banner</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addBanner();
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  id="altText"
                  name="title"
                  value={formData.title}
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
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {formData.category && (
              <div>
                <label htmlFor="test" className="block text-sm font-medium text-gray-700">
                  Select Test
                </label>
                {loadingTests ? (
                  <p className="mt-1 text-sm text-gray-500">Loading Tests...</p>
                ) : tests.length > 0 ? (
                  <select
                    name="test"
                    id="test"
                    value={formData.test}
                    className="block w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={handleInputChange}
                  >
                    <option value="">Select test</option>
                    {tests.map((test) => (
                      <option key={test.id} value={test._id}>
                         {trimName(test.testName, 50)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">No tests available</p>
                )}
                {errors.test && <p className="mt-1 text-sm text-red-600">{errors.test}</p>}
              </div>
            )}

       
             
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default MainBanner
