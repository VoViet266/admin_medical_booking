import { Edit, Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../services/api";
import ToggleField from "./ToggleField";

export default function EditModal({ item, onClose, onSaved }) {
  const isEdit = !!item?.mack;

  const [form, setForm] = useState({
    tenCk: item?.tenCk || "",
    moTaTrieuChung: item?.moTaTrieuChung || "",
    moTa: item?.moTa || "",
    coKham: item?.coKham ?? false,
    isActive: item?.isActive ?? true,
    imageUrl: item?.imageUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenCk.trim()) {
      setErr("Tên chuyên khoa không được để trống");
      return;
    }
    setSaving(true);
    setErr("");

    const payload = {
      tenCk: form.tenCk.trim(),
      moTaTrieuChung: form.moTaTrieuChung.trim(),
      moTa: form.moTa.trim(),
      coKham: form.coKham,
      isActive: form.isActive,
      imageUrl: form.imageUrl.trim(),
    };

    try {
      const res = isEdit
        ? await api.updateSpecialty(item.mack, payload)
        : await api.createSpecialty(payload);
        
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
              {isEdit ? "Chỉnh sửa Chuyên khoa" : "Thêm mới Chuyên khoa"}
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

            {/* Mã CK (readonly) */}
            {isEdit && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Mã chuyên khoa
                </label>
                <input
                  type="text"
                  value={item?.mack || ""}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 text-sm font-mono cursor-not-allowed"
                />
              </div>
            )}

            {/* Tên */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tên chuyên khoa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.tenCk}
                onChange={(e) => handleChange("tenCk", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm  outline-none transition-all"
                placeholder="VD: Tim mạch, Nội khoa..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                URL hình ảnh
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-gray-300 text-sm  outline-none transition-all"
                  placeholder="https://..."
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
            </div>

            {/* Mô tả triệu chứng */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Mô tả triệu chứng
              </label>
              <textarea
                value={form.moTaTrieuChung}
                onChange={(e) => handleChange("moTaTrieuChung", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm whitespace-pre-wrap  outline-none l resize-none"
                placeholder="Mô tả các triệu chứng liên quan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ToggleField
                label="Có khám bệnh"
                value={form.coKham}
                onChange={(v) => handleChange("coKham", v)}
                onColor="bg-blue-500"
              />
              {/* <ToggleField
                label="Hiển thị"
                value={form.isActive}
                onChange={(v) => handleChange("isActive", v)}
                onColor="bg-green-500"
              /> */}
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
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
