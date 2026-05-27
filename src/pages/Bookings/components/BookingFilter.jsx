import { Search } from "lucide-react";

export default function BookingFilter({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  onSearch,
}) {
  return (
    <div className="bg-white sticky z-10 top-0 p-4 rounded-xl shadow-sm border border-gray-200 mb-4 mt-2">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400  sm:text-sm"
              placeholder="Tìm theo tên BN, SĐT, Mã ĐK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          <div className="flex items-center">
            <input
              type="date"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none sm:text-sm text-gray-700"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center w-full md:w-auto gap-4">
          {/* Bộ lọc trạng thái */}
          <select
            className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Chờ xác nhận</option>
            <option value="1">Đã xác nhận</option>
            <option value="2">Đã hủy</option>
            <option value="3">Hoàn thành</option>
          </select>

          <button
            onClick={onSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
          >
            Lọc & Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}
