'use client';

import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-yellow-50 p-4">
            <AlertTriangle size={70} className="text-yellow-500" />
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-neutral-700">Trang Không Tìm Thấy</h2>

        <p className="mx-auto mb-8 max-w-sm text-neutral-600">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link
            href="/"
            className="flex items-center justify-center rounded-md bg-neutral-200 px-6 py-2 text-neutral-700 transition-colors hover:bg-neutral-300"
          >
            <Home size={18} className="mr-2" />
            Trang Chủ
          </Link>

          <button
            onClick={handleGoBack}
            className="flex items-center justify-center rounded-md bg-neutral-200 px-6 py-2 text-neutral-700 transition-colors hover:bg-neutral-300"
          >
            <ArrowLeft size={18} className="mr-2" />
            Quay Lại
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        © {new Date().getFullYear()} Examify - Hỗ trợ: support@examify.com
      </p>
    </div>
  );
}
