'use client';

import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-50 p-4 rounded-full">
            <AlertTriangle 
              size={70} 
              className="text-yellow-500"
            />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
          Trang Không Tìm Thấy
        </h2>
        
        <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
          <Link 
            href="/"
            className="bg-neutral-200 text-neutral-700 py-2 px-6 rounded-md hover:bg-neutral-300 transition-colors flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            Trang Chủ
          </Link>
          
          <button 
            onClick={handleGoBack}
            className="bg-neutral-200 text-neutral-700 py-2 px-6 rounded-md hover:bg-neutral-300 transition-colors flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Quay Lại
          </button>
        </div>
      </div>
      
      <p className="text-neutral-500 mt-8 text-sm">
        © {new Date().getFullYear()} Examify - Hỗ trợ: support@examify.com
      </p>
    </div>
  );
}