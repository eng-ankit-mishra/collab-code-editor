
export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-white">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-400">
        Loading application...
      </p>
    </div>
  );
}
