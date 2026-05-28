import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Stethoscope,
  Syringe,
  UserRound,
  Users,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const navigation = [
  { name: "Tổng quan", to: "/", icon: LayoutDashboard },
  { name: "Đăng ký khám", to: "/bookings", icon: CalendarDays },
  { name: "Người dùng", to: "/users", icon: Users },
  { name: "Chuyên khoa", to: "/specialties", icon: Stethoscope },
  { name: "Thiết bị y tế", to: "/equipment", icon: Syringe },
  { name: "Bác sĩ", to: "/doctors", icon: UserRound },
  { name: "Thông báo", to: "/notifications", icon: Bell },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentNav = navigation.find((item) => item.to === location.pathname);

  const handleLogout = async () => {  
    try {
      await api.Logout();
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const pageTitle = `Quản lý ${currentNav?.name.toLowerCase() || ""}`;

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <img src="/logo_bv.png" alt="Logo" className="h-13 w-13" />
          <span className="text-xl font-extrabold text-blue-900">TÂM MINH ĐỨC</span>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`mr-3 w-5 h-5 ${location.pathname === item.to ? "text-blue-700" : "text-gray-400"}`}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              className="text-gray-500 focus:outline-none md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-2xl font-bold text-gray-800 md:ml-0 capitalize-first">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 mx-auto max-w-7xl sm:p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
