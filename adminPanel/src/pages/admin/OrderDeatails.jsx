import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/get/${id}`,
          { withCredentials: true }
        );
        const data = response.data.data;
        console.log(data);
        
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
    fetchOrderDetails();
  }, [id]);

  return order ? (
    <div className="container mx-auto p-6 bg-gray-50 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Order Details</h2>
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
        <p><strong>Name:</strong> {order.name || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {order.phoneNumber || 'N/A'}</p>
        <p>
          <strong>Address:</strong> {order.address || 'N/A'}
        </p>
        <p>
          <strong>Address Type:</strong> {order.addressType || 'N/A'}
        </p>
      </div>

      <div className="bg-white p-4 mt-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p>
          <strong>Created At:</strong>{' '}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-4 mt-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Tests</h3>
        <ul className="list-disc pl-6">
          {order.items.map((item) => (
            <li key={item.testId?._id || item.testId} className="flex justify-between items-center mb-2">
              <span>
                <strong>{item.testId?.testName || 'Unknown Item'}</strong> - {item.quantity} x ₹
                {item.testId?.offerPrice || 'N/A'}
              </span>
              <button
                onClick={() => navigate(`/admin/tests/${item.testId._id}`)}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
              >
                View Test
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div className="text-center py-20">
      <p className="text-lg text-gray-500">Loading...</p>
    </div>
  );
};

export default OrderDetails;
