import React from 'react';

export default function UserFilter({ keyword, setKeyword, statusFilter, setStatusFilter, onSearch }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div></div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Tìm số điện thoại..."
          className="border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
        <select
          className="border-gray-300 rounded-md shadow-sm text-sm border px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Đã khóa</option>
        </select>
      </div>
    </div>
  );
}
