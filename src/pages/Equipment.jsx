import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Edit, Plus, Power, PowerOff } from 'lucide-react';

export default function Equipment() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 20 };
      if (keyword) params.keyword = keyword;
      
      const response = await api.getEquipment(params);
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
    fetchEquipment();
  }, [page]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.changeEquipmentStatus(id, { isActive: !currentStatus });
      if (res.success) {
        fetchEquipment();
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
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Thiết bị y tế</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Tìm thiết bị..." 
            className="border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEquipment()}
          />
          <button 
            onClick={() => {setPage(1); fetchEquipment()}}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 border"
          >
            Tìm
          </button>
          <button className="flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700">
            <Plus size={16} className="mr-2" /> Thêm mới
          </button>
        </div>
      </div>

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thiết bị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xuất xứ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Đang tải...</td></tr>
              ) : data.items?.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                data.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.hinhanh && (
                          <img className="h-10 w-10 rounded object-cover mr-3 border" src={item.hinhanh} alt="" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.tentb}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{item.mota}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.xuatxu}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isActive ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Kích hoạt</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Ngừng HĐ</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mx-1 p-1"><Edit size={18} /></button>
                      <button 
                        onClick={() => toggleStatus(item.id, item.isActive)}
                        className={`${item.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} mx-1 p-1`}
                        title={item.isActive ? 'Tắt thiết bị' : 'Bật thiết bị'}
                      >
                        {item.isActive ? <PowerOff size={18} /> : <Power size={18} />}
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
