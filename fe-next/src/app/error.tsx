'use client';

import { AlertOctagon } from 'lucide-react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <AlertOctagon 
              size={70} 
              className="text-red-500"
            />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
          Đã xảy ra lỗi
        </h2>
        
        <p className="text-neutral-600 mb-8 max-w-sm mx-auto">
          Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
        </p>
        
        <Link 
          href="/"
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition-colors inline-flex items-center justify-center"
        >
          <Home size={18} className="mr-2" />
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}



