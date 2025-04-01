'use client';
  
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User } from 'lucide-react';
import profileAvt from "../../public/avt-profile.png";
import logoImage from "../../public/Examify.png";

const NavBar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUserRole(null);
    router.push("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDropdownOpen(false);
    }
  };

  const getDashboardLink = () => {
    if (!userRole) return "/";
    return userRole === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href={getDashboardLink()} className="flex items-center space-x-2">
              <Image
                src={logoImage}
                alt="Logo"
                width={50}
                height={50}
                className="rounded-full w-auto h-auto"
              />
              <span className="text-2xl font-bold text-primary hidden sm:inline">
                Examify
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <span className="text-neutral-600 font-medium">
              Nền tảng thi trực tuyến hàng đầu cho giáo viên và học sinh
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {userRole ? (
              <div className="relative" onBlur={closeDropdown}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2"
                >
                  <Image
                    src={profileAvt}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-gray-200 hover:border-primary transition-colors"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:bg-gray-50"
                    >
                      <User size={16} className="mr-2" />
                      Thông tin {userRole === "TEACHER" ? "giáo viên" : "sinh viên"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-neutral-600 hover:text-primary transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary text-neutral-600 px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
