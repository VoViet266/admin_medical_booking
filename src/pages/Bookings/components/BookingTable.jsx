import { Edit, Eye, Trash2 } from "lucide-react";

export default function BookingTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã ĐK
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bệnh nhân
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày khám
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bác Sĩ / Chuyên khoa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Đang tải...
              </td>
            </tr>
          ) : data.items?.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.items?.map((item) => (
              <tr key={item.maDk} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{item.maDk}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.hoTen}
                  </div>
                  <div className="text-sm text-gray-500">{item.sdt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.ngay}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.timeSlot).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.tenBacSi ? item.tenBacSi : "Chưa chỉ định"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.tenCk ? item.tenCk : "Chưa chỉ định"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={item.trangThai}
                    onChange={(e) => onStatusChange(item.maDk, e.target.value)}
                    className={`text-xs font-semibold rounded-xl px-2 py-1 bg-gray-200`}
                  >
                    <option value={0}>Chờ xác nhận</option>
                    <option value={1}>Đã xác nhận</option>
                    <option value={2}>Đã hủy</option>
                    <option value={3}>Hoàn thành</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(item.maDk)}
                    className="text-blue-600 hover:text-blue-900 mx-1 p-1"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(item.maDk)}
                    className="text-indigo-600 hover:text-indigo-900 mx-1 p-1"
                    title="Sửa đổi"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item.maDk)}
                    className="text-red-600 hover:text-red-900 mx-1 p-1"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
