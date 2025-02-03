import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    // Fetch Coupons
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons/get`,
                    { withCredentials: true }
                );
                setCoupons(response.data.data);
            } catch (error) {
                toast({ title: "Error", description: "Failed to load coupons.", variant: "destructive" });
            }
        };

        fetchCoupons(); // Call function inside useEffect
    }, []);

    // Add Coupon
    const addCoupon = async () => {
        if (!code || !discount || !expiresAt) {
            toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
            return;
        }

        const newCoupon = { code, discount, expiresAt };
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons/add`,
                newCoupon,
                { withCredentials: true }
            );
            console.log(response.data.data);
            

            toast({ title: "Success", description: "Coupon added successfully." });
            setCoupons([...coupons, response.data.data]); // Update UI with the new coupon
            setCode(""); setDiscount(""); setExpiresAt(""); // Clear form
        } catch (error) {
            toast({ title: "Error", description: "Coupon already exist.", variant: "destructive" });
        }
    };

    // Delete Coupon
    const deleteCoupon = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/coupons/delete/${id}`, { withCredentials: true });
            setCoupons(coupons.filter((coupon) => coupon._id !== id)); // Update UI
            toast({ title: "Deleted", description: "Coupon removed successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete coupon.", variant: "destructive" });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Manage Coupons</h2>

            {/* Coupon Form */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <input 
                    type="text" 
                    className="border p-2 rounded flex-1" 
                    placeholder="Coupon Code" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                />
                <input 
                    type="number" 
                    className="border p-2 rounded flex-1" 
                    placeholder="Discount (%)" 
                    value={discount} 
                    onChange={(e) => setDiscount(e.target.value)} 
                />
                <input 
                    type="date" 
                    className="border p-2 rounded flex-1" 
                    value={expiresAt} 
                    onChange={(e) => setExpiresAt(e.target.value)} 
                />
                <button 
                    onClick={addCoupon} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add
                </button>
            </div>

            {/* Coupon List */}
            <h3 className="text-xl font-semibold mt-6">Existing Coupons</h3>
            {coupons.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg shadow-md mt-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">Code</th>
                                <th className="py-2 px-4 border">Discount</th>
                                <th className="py-2 px-4 border">Expiry</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon,index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border">{coupon.code}</td>
                                    <td className="py-2 px-4 border">{coupon.discount}%</td>
                                    <td className="py-2 px-4 border">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">
                                        <button 
                                            onClick={() => deleteCoupon(coupon._id)} 
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No coupons available.</p>
            )}
        </div>
    );
};

export default Coupons;
