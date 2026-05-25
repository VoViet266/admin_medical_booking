import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, CalendarDays, Activity, Stethoscope, Syringe, UserRound } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.getOverview();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <div className="text-gray-500">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  if (!data) return null;

  const stats = [
    { name: 'Tổng người dùng', value: data.tongNguoiDung, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Đang hoạt động', value: data.nguoiDungDangHoatDong, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Tổng hồ sơ', value: data.tongHoSo, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Bác sĩ trên App', value: data.tongBacSiApp, icon: UserRound, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Chuyên khoa', value: data.tongChuyenKhoaDangKham, icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-100' },
    { name: 'Thiết bị y tế', value: data.tongThietBiDangHienThi, icon: Syringe, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const bookingStats = [
    { name: 'Tổng lịch khám', value: data.tongLichKham },
    { name: 'Lịch hôm nay', value: data.lichHomNay },
    { name: 'Chờ xác nhận', value: data.lichChoXacNhan },
    { name: 'Đã xác nhận', value: data.lichDaXacNhan },
    { name: 'Đã hủy', value: data.lichDaHuy },
    { name: 'Hoàn thành', value: data.lichHoanThanh },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <dt>
              <div className={`absolute rounded-lg p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Thống kê lịch khám</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {bookingStats.map((item) => (
          <div key={item.name} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-500">{item.name}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
