import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingModal({
  isOpen,
  onClose,
  mode,
  booking,
  onSave,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    hoTen: "",
    sdt: "",
    ngay: "",
    timeSlot: "",
    tenBacSi: "",
    tenCk: "",
    trangThai: 0,
    trieuChung: "",
    cmnd: "",
    mathe: "",
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        hoTen: booking.hoTen || "",
        sdt: booking.sdt || "",
        ngay: booking.ngay || "",
        timeSlot: booking.timeSlot || "",
        tenBacSi: booking.tenBacSi || "",
        tenCk: booking.tenCk || "",
        trangThai: booking.trangThai ?? 0,
        trieuChung: booking.trieuChung || "",
        mathe: booking.mathe || "",
        cmnd: booking.cmnd || "",
      });
    }
  }, [booking]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm  p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            {mode === "view"
              ? "Chi tiết đăng ký khám"
              : "Chỉnh sửa đăng ký khám"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-scroll flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) =>
                  setFormData({ ...formData, hoTen: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.sdt}
                onChange={(e) =>
                  setFormData({ ...formData, sdt: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Căn Cước Công Dân
              </label>
              <input
                type="text"
                value={formData.cmnd}
                onChange={(e) =>
                  setFormData({ ...formData, cmnd: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thẻ bảo hiểm
              </label>
              <input
                type="text"
                value={formData.mathe}
                onChange={(e) =>
                  setFormData({ ...formData, mathe: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày khám
              </label>
              <input
                type="date"
                value={formData.ngay?.split("T")[0] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ngay: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ đặt khám
              </label>
              <input
                type="datetime-local"
                value={
                  formData.timeSlot
                    ? new Date(formData.timeSlot).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeSlot: new Date(e.target.value).toISOString(),
                  })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bác sĩ - Chuyên khoa
              </label>
              <input
                type="text"
                value={`${formData.tenBacSi || "Chưa chỉ định"} - ${formData.tenCk || "Chưa chỉ định"}`}
                readOnly
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Triệu chứng / Ghi chú
              </label>
              <textarea
                rows={3}
                value={formData.trieuChung}
                onChange={(e) =>
                  setFormData({ ...formData, trieuChung: e.target.value })
                }
                readOnly={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={mode === "view"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.trangThai}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trangThai: Number(e.target.value),
                  })
                }
                disabled={mode === "view"}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value={0}>Chờ xác nhận</option>
                <option value={1}>Đã xác nhận</option>
                <option value={2}>Đã hủy</option>
                <option value={3}>Hoàn thành</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
          {mode === "edit" && (
            <button
              onClick={() => onSave(formData)}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
