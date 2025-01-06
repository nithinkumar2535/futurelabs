import React, {useState, useEffect} from 'react'
import axios from 'axios';

function Prescription() {
    const [prescriptions, setPrescriptions] = useState([]);

    // Fetch prescriptions from the backend
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/prescription/get",
          {withCredentials: true}
        );
        console.log(response.data);
        
        setPrescriptions(response.data.data);

      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };
  
    // Handle delete action
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      if (!confirmDelete) return;
  
      try {
        await axios.delete(`http://localhost:3000/api/v1/prescription/delete/${id}`,
          {withCredentials: true}
        );
        alert("Prescription deleted successfully.");
        fetchPrescriptions(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting prescription:", error);
        alert("Failed to delete prescription.");
      }
    };
  
    // Fetch prescriptions on component mount
    useEffect(() => {
      fetchPrescriptions();
    }, []);
  
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">WhatsApp Number</th>
                <th className="border border-gray-300 px-4 py-2">Prescription Image</th>
                <th className="border border-gray-300 px-4 py-2">Uploaded At</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{prescription.whatsapp}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={`http://localhost:3000/uploads/${prescription.imagePath.split('/').pop()}`}
                      alt="Prescription"
                      className="w-24 h-24 object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(prescription.uploadedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleDelete(prescription._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Prescription
