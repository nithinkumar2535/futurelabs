import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,
      {},
      { withCredentials: true }
    );
    if (response.status === 200) {
      console.log("Logged out successfully");
      navigate('/');
    } else {
      toast({ title: 'Error', description: 'Something went wrong when logging out' });
    }
  };



  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-bottom ">
      <button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle Menu</span>
      </button>

      <div className="flex flex-1 justify-between items-center">
       

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-black inline-flex text-white text-sm font-medium py-2 px-2 rounded-md items-center shadow"
        >
          <LogOut />
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
