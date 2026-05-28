import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Plus,
  Power,
  PowerOff,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import EditModal from "./EditModal";

export default function Equipment() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const fetchEquipment = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize: 20 };
      if (keyword) params.keyword = keyword;

      const response = await api.getEquipment(params);
      if (response.success) {
        setData(response.data || { items: [], totalPages: 1, page: 1 });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment(page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchEquipment(1);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.changeEquipmentStatus(id, {
        isActive: !currentStatus,
      });
      if (res.success) {
        fetchEquipment(page);
      } else {
        alert("Lỗi: " + res.message);
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="bg-white flex justify-between sticky z-10 top-0 p-4 rounded-xl shadow-sm border border-gray-200 mb-4 mt-2">
        <div></div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm thiết bị..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none w-52 transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            Tìm
          </button>
          <button
            onClick={() => setEditItem({})}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg  transition-colors shadow-sm"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thiết bị
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Xuất xứ
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : data.items?.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-400 text-sm"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                data.items?.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.hinhanh ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover border border-gray-200 shadow-sm"
                            src={api.getUrl(item.hinhanh)}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg  flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm">
                            {item.tentb?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {item.tentb}
                          </div>
                          {item.mota && (
                            <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                              {item.mota}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {item.xuatxu || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isActive ? (
                        <span className="px-2.5 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                          Ngừng HĐ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() => toggleStatus(item.id, item.isActive)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.isActive
                              ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                              : "text-green-500 hover:bg-green-50 hover:text-green-700"
                          }`}
                          title={
                            item.isActive ? "Ẩn thiết bị" : "Hiện thiết bị"
                          }
                        >
                          {item.isActive ? (
                            <PowerOff size={17} />
                          ) : (
                            <Power size={17} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50">
            <span className="text-sm text-gray-500">
              Trang <span className="font-medium text-gray-800">{page}</span> /{" "}
              <span className="font-medium text-gray-800">
                {data.totalPages}
              </span>
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} /> Trước
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={() => fetchEquipment(page)}
        />
      )}
    </div>
  );
}
