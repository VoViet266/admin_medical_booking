import { Info, X } from 'lucide-react';
import { api } from '../../services/api';
import InfoRow from '../Specialties/components/InfoRow';

export default function DetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-teal-600">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-white opacity-80" />
            <h3 className="text-lg font-semibold text-white">Chi tiết Bác sĩ</h3>
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
            {item.hinhanh ? (
              <img
                src={api.getUrl(item.hinhanh)}
                alt={item.hoTen}
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-100 shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-teal-700 text-3xl font-bold shadow">
                {item.hoTen?.charAt(0) || item.ten?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xl font-bold text-gray-900">{item.hoTen || item.ten}</p>
              <p className="text-sm text-gray-500 font-medium">{item.hocvan || 'Bác sĩ'}</p>
              <p className="text-xs text-gray-400 mt-1">
                Mã NV: <span className="font-mono text-teal-600">{item.manv}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Phòng làm việc" value={item.tenPhong || 'Chưa phân phòng'} />
            <InfoRow
              label="Trạng thái"
              value={
                item.trangthai === 'Hoạt động' ? (
                  <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    {item.trangthai}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                    {item.trangthai || 'Ngừng HĐ'}
                  </span>
                )
              }
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Chuyên khoa phụ trách
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.danhSachChuyenKhoa && item.danhSachChuyenKhoa.length > 0 ? (
                item.danhSachChuyenKhoa.map((ck, i) => (
                  <span key={i} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs rounded border border-teal-100 font-medium">
                    {ck.tenCk}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500 italic">Chưa có chuyên khoa</span>
              )}
            </div>
          </div>

          {item.mota && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Giới thiệu
              </p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed border border-gray-100 max-h-40 overflow-y-auto">
                {item.mota}
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
