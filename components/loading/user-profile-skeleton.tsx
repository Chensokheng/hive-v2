export function UserProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* User Profile Section */}
      <div className="flex items-center gap-4">
        <div className="h-15 w-15 rounded-full bg-gray-300"></div>
        <div>
          <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* TrueMoney Balance Card */}
      <div className="bg-gray-100 rounded-2xl p-4 space-y-3 mt-5">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-full bg-gray-300"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>

      {/* Vouchers and Stamps Grid */}
      <div className="grid grid-cols-2 gap-[10px] mt-2">
        <div className="bg-gray-100 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-6 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-6 w-8 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] w-full bg-gray-200 my-5"></div>

      {/* Menu Buttons */}
      <div className="space-y-2">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-5">
        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
