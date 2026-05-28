import { Edit, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { api } from "../../services/api";
import ToggleField from "../Specialties/components/ToggleField";

export default function EditModal({ item, onClose, onSaved }) {
  const isEdit = !!item?.id;

  const [form, setForm] = useState({
    tentb: item?.tentb || "",
    hinhanh: item?.hinhanh || "",
    mota: item?.mota || "",
    xuatxu: item?.xuatxu || "",
    isActive: item?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);


  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Xóa ảnh: gọi API xóa file trên server rồi clear state
  const handleRemoveImage = async () => {
    const pathToDelete = form.hinhanh;
    handleChange("hinhanh", "");
    setPendingFile(null);
    setPreviewUrl(null);
    if (pathToDelete) {
      try {
        await api.deleteFile(pathToDelete);
      } catch {
        // Không block UI nếu xóa file thất bại
      }
    }
  };

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tentb.trim()) {
      setErr("Tên thiết bị không được để trống");
      return;
    }
    setSaving(true);
    setErr("");
    let hinhanhPath = form.hinhanh.trim();
    if (pendingFile) {
      // Nếu đang thay ảnh mới → xóa ảnh cũ trước (nếu có)
      const oldPath = item?.hinhanh?.trim();
      if (oldPath && oldPath !== hinhanhPath) {
        try { await api.deleteFile(oldPath); } catch { /* bỏ qua lỗi xóa */ }
      }
      try {
        const uploadRes = await api.uploadFile(pendingFile, "HinhAnh_ThietBi");
        console.log(uploadRes)
        if (uploadRes.success && uploadRes.data) {
          hinhanhPath = uploadRes.data;
        
        } else {
          setErr(uploadRes.message || "Upload ảnh thất bại");
          setSaving(false);
          return;
        }
      } catch (uploadErr) {
        setErr(uploadErr.message || "Upload ảnh thất bại");
        setSaving(false);
        return;
      }
    }

    const payload = {
      tentb: form.tentb.trim(),
      hinhanh: hinhanhPath,
      mota: form.mota.trim(),
      xuatxu: form.xuatxu.trim(),
      isActive: form.isActive,
    };
    console.log(payload)
    try {
      const res = isEdit
        ? await api.updateEquipment(item.id, payload)
        : await api.createEquipment(payload);

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setErr(res.message || (isEdit ? "Cập nhật thất bại" : "Thêm mới thất bại"));
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
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-700">
          <div className="flex items-center gap-3">
            <Edit size={20} className="text-white opacity-80" />
            <h3 className="text-lg font-semibold text-white">
              {isEdit ? "Chỉnh sửa Thiết bị" : "Thêm mới Thiết bị"}
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

            {isEdit && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  ID Thiết bị
                </label>
                <input
                  type="text"
                  value={item?.id || ""}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm font-mono cursor-not-allowed"
                />
              </div>
            )}

            {/* Tên thiết bị */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tên thiết bị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.tentb}
                onChange={(e) => handleChange("tentb", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="VD: Máy siêu âm 4D..."
              />
            </div>

            {/* Xuất xứ */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Xuất xứ
              </label>
              <input
                type="text"
                value={form.xuatxu}
                onChange={(e) => handleChange("xuatxu", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="VD: Nhật Bản, Đức..."
              />
            </div>

            {/* Hình ảnh */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Hình ảnh thiết bị
              </label>
              <div className="flex gap-3 items-center">
                {/* Preview: ưu tiên blob URL nếu đang chọn file mới */}
                <div className="relative w-16 h-16 shrink-0">
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {previewUrl || form.hinhanh ? (
                      <img
                        src={previewUrl || api.getUrl(form.hinhanh)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
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
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-blue-400 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Upload size={14} />
                    {pendingFile ? `Đã chọn: ${pendingFile.name}` : "Chọn ảnh từ máy"}
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
                Mô tả chi tiết
              </label>
              <textarea
                value={form.mota}
                onChange={(e) => handleChange("mota", e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 outline-none transition-all resize-none"
                placeholder="Thông số kỹ thuật, công dụng..."
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 gap-4">
              <ToggleField
                label="Hoạt động"
                value={form.isActive}
                onChange={(v) => handleChange("isActive", v)}
                onColor="bg-green-500"
              />
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-400 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
