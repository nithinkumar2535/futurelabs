import React, { useState, useEffect } from "react";
import axios from "axios";

const LoggedInUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/users`,
                    { withCredentials: true }
                );
                setUsers(response.data.data.loggedInUsers);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch logged-in users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="text-center mt-10 text-lg font-medium">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-lg text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Logged-In Users</h1>
            {users.length === 0 ? (
                <div className="text-center text-gray-500">No logged-in users found.</div>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Phone Number</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {new Date(user.lastLogin).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LoggedInUsers;
