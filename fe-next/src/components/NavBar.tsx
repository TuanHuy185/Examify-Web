'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import profileAvt from '../../public/avt-profile.png';
import logoImage from '../../public/Examify.png';

interface NavBarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  onLogout?: () => void;
}

const NavBar = ({ isAuthenticated, userRole: propUserRole, onLogout }: NavBarProps) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (propUserRole) {
      setUserRole(propUserRole);
    } else {
      setUserRole(localStorage.getItem('userRole'));
    }
  }, [propUserRole]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setUserRole(null);
    if (onLogout) {
      onLogout();
    } else {
      router.push('/login');
    }
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
    if (!userRole) return '/';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={getDashboardLink()} className="flex items-center space-x-2">
              <Image
                src={logoImage}
                alt="Logo"
                width={50}
                height={50}
                className="h-auto w-auto rounded-full"
              />
              <span className="hidden text-2xl font-bold text-primary sm:inline">Examify</span>
            </Link>
          </div>

          <div className="hidden items-center space-x-6 md:flex">
            <span className="font-medium text-neutral-600">
              Nền tảng thi trực tuyến hàng đầu cho giáo viên và học sinh
            </span>
          </div>

          {isAuthenticated || userRole ? (
            <div className="relative" onBlur={closeDropdown}>
              <button onClick={toggleDropdown} className="flex items-center space-x-2">
                <Image
                  src={profileAvt}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-gray-200 transition-colors hover:border-primary"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:bg-gray-50"
                  >
                    <User size={16} className="mr-2" />
                    Thông tin {userRole === 'TEACHER' ? 'giáo viên' : 'sinh viên'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-neutral-600 transition-colors hover:text-primary">
                Đăng nhập
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-neutral-600 transition-colors hover:bg-secondary"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
