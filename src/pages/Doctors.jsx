import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Edit, Eye } from 'lucide-react';

export default function Doctors() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [maCk, setMaCk] = useState('');
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    // Fetch specialties for filter dropdown
    api.getSpecialties({ pageSize: 100 }).then(res => {
      if (res.success) setSpecialties(res.data.items || []);
    });
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 20 };
      if (keyword) params.keyword = keyword;
      if (maCk) params.maCk = maCk;
      
      const response = await api.getDoctors(params);
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
    fetchDoctors();
  }, [page, maCk]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Tìm tên hoặc mã NV..." 
            className="border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
          />
          <button 
            onClick={() => {setPage(1); fetchDoctors()}}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 border"
          >
            Tìm
          </button>
          <select 
            className="border-gray-300 rounded-md shadow-sm text-sm border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 max-w-[200px]"
            value={maCk}
            onChange={(e) => { setPage(1); setMaCk(e.target.value); }}
          >
            <option value="">Tất cả chuyên khoa</option>
            {specialties.map(ck => (
              <option key={ck.mack} value={ck.mack}>{ck.tenCk}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng / Chuyên khoa</th>
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
                  <tr key={item.manv} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.manv}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.hinhanh ? (
                          <img className="h-10 w-10 rounded-full object-cover mr-3 border" src={item.hinhanh} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500 font-bold">
                            {item.ten?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.hoTen}</div>
                          <div className="text-xs text-gray-500">{item.hocvan}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.tenPhong}</div>
                      <div className="text-xs text-gray-500">{item.danhSachChuyenKhoa?.map(ck => ck.tenck).join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.trangthai === 'Hoạt động' ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{item.trangthai}</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{item.trangthai}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mx-1 p-1"><Eye size={18} /></button>
                      <button className="text-indigo-600 hover:text-indigo-900 mx-1 p-1"><Edit size={18} /></button>
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
