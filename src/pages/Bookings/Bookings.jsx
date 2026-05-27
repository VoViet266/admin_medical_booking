import { useEffect, useState } from "react";
import { api } from "../../services/api";
import BookingFilter from "./components/BookingFilter";
import BookingModal from "./components/BookingModal";
import BookingTable from "./components/BookingTable";
import Pagination from "../../components/Pagination";

export default function Bookings() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 20 };
      if (statusFilter !== "") params.trangThai = statusFilter;
      if (searchTerm.trim() !== "") params.search = searchTerm.trim();
      if (dateFilter !== "") params.ngay = dateFilter;

      const response = await api.getBookings(params);
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
    fetchBookings();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchBookings();
  };

  const handleView = async (id) => {
    try {
      const response = await api.getBookingDetail(id);
      if (response.success) {
        setSelectedBooking(response.data);
        setModalMode("view");
        setIsModalOpen(true);
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await api.getBookingDetail(id);
      if (response.success) {
        setSelectedBooking(response.data);
        setModalMode("edit");
        setIsModalOpen(true);
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đăng ký này?")) return;
    try {
      const res = await api.deleteBooking(id);
      if (res.success || res) {
        fetchBookings();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (formData) => {
    if (!selectedBooking) return;
    setIsSaving(true);
    try {
      if (formData.trangThai !== selectedBooking.trangThai) {
        await api.changeBookingStatus(selectedBooking.maDk, {
          trangThai: formData.trangThai,
        });
      }

      const updateData = {
        hoTen: formData.hoTen,
        sdt: formData.sdt,
        ngay: formData.ngay,
        timeSlot: formData.timeSlot,
        trieuChung: formData.trieuChung,
      };

      const response = await api.updateBooking(
        selectedBooking.maDk,
        updateData,
      );

      if (response.success || response) {
        setIsModalOpen(false);
        fetchBookings();
      } else {
        alert(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await api.changeBookingStatus(id, {
        trangThai: Number(newStatus),
      });
      if (res.success || res) {
        fetchBookings();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4 relative">
      <BookingFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleSearch}
      />

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <BookingTable
          data={data}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleQuickStatusChange}
        />
        {/* Pagination */}
        {!loading && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        booking={selectedBooking}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
