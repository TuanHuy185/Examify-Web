'use client';

import { AlertOctagon } from 'lucide-react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <AlertOctagon size={70} className="text-red-500" />
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-neutral-700">Đã xảy ra lỗi</h2>

        <p className="mx-auto mb-8 max-w-sm text-neutral-600">
          Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-white transition-colors hover:bg-secondary"
        >
          <Home size={18} className="mr-2" />
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
