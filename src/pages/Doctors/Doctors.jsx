import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Info,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DetailModal from "./DetailModal";
import EditModal from "./EditModal";

export default function Doctors() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [maCk, setMaCk] = useState("");
  const [specialties, setSpecialties] = useState([]);

  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    api.getSpecialties({ pageSize: 100 }).then((res) => {
      if (res.success) setSpecialties(res.data.items || []);
    });
  }, []);

  const fetchDoctors = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, pageSize: 20 };
      if (keyword) params.keyword = keyword;
      if (maCk) params.maCk = maCk;

      const response = await api.getDoctors(params);
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
    fetchDoctors(page);
  }, [page, maCk]);

  const handleSearch = () => {
    setPage(1);
    fetchDoctors(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã NV..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-52 transition-all"
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
          <select
            className="border-gray-300 rounded-lg shadow-sm text-sm border px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none max-w-[200px]"
            value={maCk}
            onChange={(e) => {
              setPage(1);
              setMaCk(e.target.value);
            }}
          >
            <option value="">Tất cả chuyên khoa</option>
            {specialties.map((ck) => (
              <option key={ck.mack} value={ck.mack}>
                {ck.tenCk}
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditItem({})}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
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
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mã NV
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phòng / Chuyên khoa
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
                    key={item.manv}
                    className="hover:bg-teal-50/30 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.manv}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.hinhanh ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                            src={api.getUrl(item.hinhanh)}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm shadow-sm">
                            {item.hoTen?.charAt(0) || item.ten?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {item.hoTen || item.ten}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.hocvan || "Bác sĩ"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {item.tenPhong || "—"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                        {item.danhSachChuyenKhoa?.length > 0
                          ? item.danhSachChuyenKhoa.map((ck) => (
                              <span
                                key={ck.mack}
                                className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
                              >
                                {ck.tenCk}
                              </span>
                            ))
                          : "Chưa có"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.trangthai === "Hoạt động" ? (
                        <span className="px-2.5 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          {item.trangthai}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                          {item.trangthai || "Ngừng HĐ"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Info size={17} />
                        </button>
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={17} />
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
          specialties={specialties}
          onClose={() => setEditItem(null)}
          onSaved={() => fetchDoctors(page)}
        />
      )}
    </div>
  );
}
