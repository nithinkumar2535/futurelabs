import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TestDetails = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/tests/get-test/${id}`
        );
        setTest(response.data.data);
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    };

    fetchTestDetails();
  }, [id]);

  return test ? (
    <div className="container mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        {test.testName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-gray-600">{test.overview || 'No overview available'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="text-gray-600">{test.instruction || 'No instructions available'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 mt-6 rounded-lg shadow-md">
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Details</h3>
          <ul className="text-gray-600">
            <li><strong>Price:</strong> ₹{test.price}</li>
            <li><strong>Offer Price:</strong> ₹{test.offerPrice || 'N/A'}</li>
            <li><strong>Discount:</strong> {test.discountPercentage || 0}%</li>
            <li><strong>Fasting Required:</strong> {test.fasting ? 'Yes' : 'No'}</li>
            {test.fasting && <li><strong>Fasting Time:</strong> {test.fastingTime}</li>}
            <li><strong>Report Time:</strong> {test.reportTime}</li>
            <li><strong>Sample Type:</strong> {test.sampleType || 'N/A'}</li>
            <li><strong>Tube Type:</strong> {test.tubeType || 'N/A'}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <ul className="text-gray-600">
            <li><strong>Category:</strong> {test.category || 'N/A'}</li>
            <li><strong>Subcategory:</strong> {test.subcategory || 'N/A'}</li>
          </ul>
          <h3 className="text-lg font-semibold mt-4 mb-2">Included Tests</h3>
          <ul className="list-disc pl-6 text-gray-600">
            {test.includedTests?.map((testItem, index) => (
              <li key={index}>
                <strong>{testItem.category}:</strong> {testItem.tests.join(', ')}
              </li>
            )) || 'No tests included'}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Risk</h3>
        <p className="text-gray-600">{test.risk || 'No risk information available'}</p>
      </div>
    </div>
  ) : (
    <div className="text-center py-20">
      <p className="text-lg text-gray-500">Loading...</p>
    </div>
  );
};

export default TestDetails;
