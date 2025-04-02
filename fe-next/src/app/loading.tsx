export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <p className="mt-4 text-neutral-600">Đang tải...</p>
    </div>
  );
}
