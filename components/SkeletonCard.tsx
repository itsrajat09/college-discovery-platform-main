export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-5 animate-pulse">
      <div className="flex justify-between">
        <div>
          <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-100 rounded mt-4" />
      <div className="h-3 w-4/5 bg-gray-100 rounded mt-2" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="h-12 bg-gray-100 rounded-lg" />
        <div className="h-12 bg-gray-100 rounded-lg" />
      </div>
      <div className="mt-4 h-9 bg-gray-200 rounded-xl" />
    </div>
  );
}
