export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-neutral-600">Đang tải...</p>
    </div>
  );
}
