import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Lock, Unlock, Eye } from 'lucide-react';

export default function Users() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 20 };
      if (statusFilter !== '') params.isActive = statusFilter;
      if (keyword) params.keyword = keyword;
      
      const response = await api.getUsers(params);
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
    fetchUsers();
  }, [page, statusFilter]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.changeUserStatus(id, { isActive: !currentStatus });
      if (res.success) {
        fetchUsers();
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Tìm số điện thoại..." 
            className="border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
          />
          <button 
            onClick={() => {setPage(1); fetchUsers()}}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
          <select 
            className="border-gray-300 rounded-md shadow-sm text-sm border px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Đã khóa</option>
          </select>
        </div>
      </div>

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số hồ sơ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Đang tải...</td></tr>
              ) : data.items?.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                data.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.soDienThoai}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.ngayTao).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-600 rounded-full">{item.soHoSo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Hoạt động</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Đã khóa</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mx-1 p-1" title="Xem chi tiết"><Eye size={18} /></button>
                      <button 
                        onClick={() => toggleStatus(item.id, item.isActive)}
                        className={`${item.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} mx-1 p-1`}
                        title={item.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {item.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
