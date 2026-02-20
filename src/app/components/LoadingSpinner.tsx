export function LoadingSpinner() {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading weather data...</p>
    </div>
  );
}
