
export default function SplashScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-400">
        Loading...
      </p>
    </div>
  );
}
