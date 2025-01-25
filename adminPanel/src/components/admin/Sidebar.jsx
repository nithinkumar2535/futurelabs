import React, { Fragment,useState } from 'react'
import { BriefcaseMedical, ChartNoAxesCombined,Menu} from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, NotebookPen, ShoppingCart, Images } from "lucide-react";
import { useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";



function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const adminSidebarMenuItems = [
    {
      id: "orders",
      label: "Orders",
      path: "/admin/orders",
      icon: <LayoutDashboard />,
    },
    {
      id: "users",
      label: "Users",
      path: "/admin/users",
      icon: <LayoutDashboard />,
    },
    {
      id: "Tests",
      label: "Tests",
      path: "/admin",
      icon: <LayoutDashboard />,
    },
    {
      id: "banner",
      label: "Banner",
      icon: <NotebookPen />,
      children: [
        {
          id: "mainbanner",
          label: "Top Banner",
          path: "/admin/mainbanner",
          icon: <Images />,
        },
        {
          id: "bottombanner",
          label: "Bottom Banner",
          path: "/admin/bottombanner",
          icon: <Images />,
        },
      ],
    },
    {
      id: "prescription",
      label: "Prescription",
      path: "/admin/prescription",
      icon: <NotebookPen />,
    },
    {
      id: "categories",
      label: "Categories",
      icon: <NotebookPen />,
      children: [
        {
          id: "lp&mt",
          label: "LP & MT",
          path: "/admin/packages/less-price-packages",
          icon: <NotebookPen />
        },
        {
          id: "womenagegroup",
          label: "Women Age Categories",
          path: "/admin/packages/women/age",
          icon: <NotebookPen />,
        },
        {
          id: "menagegroup",
          label: "Men Age Categories",
          path: "/admin/packages/men/age",
          icon: <NotebookPen />,
        },
        {
          id: "lifestyle",
          label: "Life Style Packages",
          path: "/admin/packages/life-style",
          icon: <NotebookPen />,
        },
        {
          id: "men",
          label: "Men Packages",
          path: "/admin/packages/men",
          icon: <NotebookPen />,
        },
        {
          id: "organ",
          label: "Organ Packages",
          path: "/admin/packages/organ",
          icon: <NotebookPen />,
        },
        {
          id: "women",
          label: "Women Packages",
          path: "/admin/packages/women",
          icon: <NotebookPen />,
        },
        {
          id: "special",
          label: "Special Care Packages",
          path: "/admin/packages/special",
          icon: <NotebookPen />,
        },
        {
          id: "single",
          label: "Single Tests",
          path: "/admin/packages/single",
          icon: <NotebookPen />,
        },
      ],
    },
  ];

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mt-8 flex-col flex gap-3 ">
      {adminSidebarMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="group">
          {menuItem.children ? (
            <div>
              <div
                onClick={() => toggleMenu(menuItem.id)}
                className={`flex justify-between items-center text-xl font-medium cursor-pointer gap-2 rounded-md px-4 py-3 bg-gray-100 group-hover:bg-gray-200 group-hover:text-gray-800 ${
                  openMenu === menuItem.id ? "bg-gray-200 text-gray-800" : "text-gray-600"
                } transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 group-hover:text-gray-800 transition-all duration-200">
                    {menuItem.icon}
                  </span>
                  <span>{menuItem.label}</span>
                </div>
                <span>{openMenu === menuItem.id ? "▲" : "▼"}</span>
              </div>
              {openMenu === menuItem.id && (
                <div className="ml-6 flex flex-col gap-2 mt-2">
                  {menuItem.children.map((childItem) => (
                    <div
                      key={childItem.id}
                      onClick={() => {
                        navigate(childItem.path);
                        setOpen?.(false);
                      }}
                      className={`flex items-center text-lg gap-3 cursor-pointer rounded-md px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:text-gray-800 ${
                        isActive(childItem.path) ? "bg-gray-200 text-gray-800" : "text-gray-600"
                      } transition-all duration-200`}
                    >
                      <span>{childItem.icon}</span>
                      <span>{childItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => {
                navigate(menuItem.path);
                setOpen?.(false);
              }}
              className={`flex items-center text-xl gap-3 cursor-pointer rounded-md px-4 py-3 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 ${
                isActive(menuItem.path) ? "bg-gray-200 text-gray-800" : "text-gray-600"
              } transition-all duration-200`}
            >
              <span>{menuItem.icon}</span>
              <span>{menuItem.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>

  );
}


function AdminSidebar({open, setOpen}) {
  const navigate = useNavigate()
  return (
    <Fragment>
      {/* Sliding Sidebar (For smaller screens) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div onClick={() => navigate("/admin/orders")} className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-3">
                <ChartNoAxesCombined size={30} />
                <img src="/ft-logo.svg" alt="AdminPanel" />
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Fixed Sidebar (For larger screens) */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <img src="/ft-logo.svg" alt="AdminPanel" />
        </div>
        {/* Add scrolling to the menu */}
        <div className="flex-1 overflow-y-auto mt-4">
          <MenuItems />
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSidebar