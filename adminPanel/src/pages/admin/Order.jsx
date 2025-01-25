import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/get`,
          { withCredentials: true }
        );
        const data = response.data.data;
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/delete/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
        } else {
          console.error('Failed to delete order');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/orders/update/${id}`,
        { status },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === id ? { ...order, status } : order
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Total Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
              </div>
            ) : (
              orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
                    <td
                      className="px-6 py-4 text-sm text-blue-600 underline cursor-pointer"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      {order._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                        onClick={() => deleteOrder(order._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
