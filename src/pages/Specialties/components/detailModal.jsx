import { Info, X } from "lucide-react";
import InfoRow from "./InfoRow";

export default function DetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-700">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-white opacity-80" />
            <h3 className="text-lg font-semibold text-white">
              Chi tiết Chuyên khoa
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.tenCk}
                className="w-20 h-20 rounded-xl object-cover border-2 border-indigo-100 shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-linear-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow">
                {item.tenCk?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xl font-bold text-gray-900">{item.tenCk}</p>
              <p className="text-sm text-gray-400">
                Mã CK:{" "}
                <span className="font-mono text-indigo-600">{item.mack}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Trạng thái"
              value={
                item.isActive ? (
                  <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Hiển thị
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                    Đang ẩn
                  </span>
                )
              }
            />
          </div>

          {item.moTaTrieuChung && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Mô tả triệu chứng
              </p>
              <p className="text-sm whitespace-pre-wrap text-gray-700 bg-gray-50 rounded-lg p-3  border border-gray-100">
                {item.moTaTrieuChung}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
