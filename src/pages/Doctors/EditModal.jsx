import { Edit, Loader2, Save, Trash2, Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { api } from "../../services/api";

export default function EditModal({ item, specialties, onClose, onSaved }) {
  const isEdit = !!item?.manv;

  const [form, setForm] = useState({
    manv: item?.manv || '',
    hinhanh: item?.hinhanh || '',
    hocvan: item?.hocvan || '',
    mota: item?.mota || '',
    phong: item?.phong || '',
    tenPhong: item?.tenPhong || '',
    maChuyenKhoas: item?.danhSachChuyenKhoa?.map(ck => ck.mack) || [],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleRemoveImage = async () => {
    const pathToDelete = form.hinhanh;
    handleChange('hinhanh', '');
    setPendingFile(null);
    setPreviewUrl(null);
    if (pathToDelete) {
      try {
        await api.deleteFile(pathToDelete);
      } catch {
      }
    }
  };

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleChuyenKhoa = (mack) => {
    setForm(f => {
      const isSelected = f.maChuyenKhoas.includes(mack);
      const newMaChuyenKhoas = isSelected
        ? f.maChuyenKhoas.filter(id => id !== mack)
        : [...f.maChuyenKhoas, mack];
      return { ...f, maChuyenKhoas: newMaChuyenKhoas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.manv.trim()) {
      setErr('Mã NV không được để trống');
      return;
    }
    setSaving(true);
    setErr('');


    let hinhanhPath = form.hinhanh.trim();
    if (pendingFile) {
      const oldPath = item?.hinhanh?.trim();
      if (oldPath && oldPath == hinhanhPath) {
        try {
          console.log("delete file")
          console.log(oldPath)
          await api.deleteFile(oldPath); 
        } catch (error) {
          
         }
      }
      try {
        const uploadRes = await api.uploadFile(pendingFile, 'HinhAnh_NhanVien');
        if (uploadRes.success && uploadRes.data) {
          hinhanhPath = uploadRes.data;
        } else {
          setErr(uploadRes.message || 'Upload ảnh thất bại');
          setSaving(false);
          return;
        }
      } catch (uploadErr) {
        setErr(uploadErr.message || 'Upload ảnh thất bại');
        setSaving(false);
        return;
      }
    }

    const payload = {
      manv: form.manv.trim(),
      hinhanh: hinhanhPath,
      hocvan: form.hocvan.trim(),
      mota: form.mota.trim(),
      phong: form.phong.trim(),
      maChuyenKhoas: form.maChuyenKhoas,
    };
    try {
      const res = isEdit
        ? await api.updateDoctorInfo(item.manv, payload)
        : await api.addDoctors(payload);

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setErr(res.message || (isEdit ? 'Cập nhật thất bại' : 'Thêm mới thất bại'));
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 ">
          <div className="flex items-center gap-3">
            <Edit size={20} className="text-white opacity-80" />
            <h3 className="text-lg font-semibold text-white">
              {isEdit ? 'Chỉnh sửa Bác sĩ' : 'Thêm mới Bác sĩ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                {err}
              </div>
            )}

            {/* Mã NV */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Mã NV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.manv}
                onChange={(e) => handleChange('manv', e.target.value)}
                readOnly={isEdit}
                className={`w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none transition-all ${isEdit ? 'bg-gray-100 text-gray-500 font-mono cursor-not-allowed' : 'focus:ring-2 focus:ring-teal-500 focus:border-teal-500'}`}
                placeholder="VD: NV001"
              />
              {!isEdit && <p className="text-xs text-gray-400 mt-1">Lưu ý: Mã NV phải tương ứng với một người dùng đã có trong hệ thống.</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Học vị / Chuyên môn
              </label>
              <input
                type="text"
                value={form.hocvan}
                onChange={(e) => handleChange('hocvan', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="VD: Thạc sĩ, Tiến sĩ, Bác sĩ CKI..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phòng làm việc
              </label>
              <input
                type="text"
                value={form.phong}
                onChange={(e) => handleChange('phong', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Nhập mã phòng khám..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tên phòng làm việc
              </label>
              <input
              readOnly
                type="text"
                value={form.tenPhong}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Tự động lấy từ mã phòng"
              />
            </div>

            {/* Hình ảnh */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Hình ảnh bác sĩ
              </label>
              <div className="flex gap-3 items-center">
                {/* Preview */}
                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {previewUrl || form.hinhanh ? (
                      <img
                        src={previewUrl || api.getUrl(form.hinhanh)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ) : (
                      <Upload size={20} className="text-gray-400" />
                    )}
                  </div>
                  {/* Nút xóa ảnh nhỏ góc trên phải */}
                  {(previewUrl || form.hinhanh) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      title="Xóa ảnh"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-teal-400 text-teal-600 text-sm font-medium hover:bg-teal-50 transition-colors"
                  >
                    <Upload size={14} />
                    {pendingFile ? `Đã chọn: ${pendingFile.name}` : 'Chọn ảnh từ máy'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {!pendingFile && form.hinhanh && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors w-fit"
                    >
                      <Trash2 size={12} /> Xóa ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Giới thiệu
              </label>
              <textarea
                value={form.mota}
                onChange={(e) => handleChange('mota', e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                placeholder="Vài nét giới thiệu về bác sĩ..."
              />
            </div>

            {/* Chuyên khoa */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Chuyên khoa phụ trách
              </label>
              <div className="grid grid-cols-2 gap-2 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                {specialties.length === 0 ? (
                  <span className="text-sm text-gray-500 col-span-2">Không có dữ liệu chuyên khoa</span>
                ) : (
                  specialties.map(ck => (
                    <label key={ck.mack} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                        checked={form.maChuyenKhoas.includes(ck.mack)}
                        onChange={() => toggleChuyenKhoa(ck.mack)}
                      />
                      <span className="text-sm text-gray-700 select-none line-clamp-1" title={ck.tenCk}>{ck.tenCk}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
