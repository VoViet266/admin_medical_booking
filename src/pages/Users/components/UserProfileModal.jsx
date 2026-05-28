import React, { useEffect, useState } from 'react';
import { X, User } from 'lucide-react';
import { api } from '../../../services/api';

export default function UserProfileModal({ user, onClose }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await api.getUserDetail(user.id);
        if (response.success) {
          const data = response.data;
          const userProfiles = data?.hoSoBieuThu || data?.danhSachHoSo || data?.hoSo || data?.profiles || [];
          setProfiles(userProfiles);
        } else {
          setError(response.message || 'Lỗi khi tải danh sách hồ sơ');
        }
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Hồ sơ của: {user.soDienThoai}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải hồ sơ...</div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Người dùng này chưa có hồ sơ nào.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile, idx) => (
                <div key={profile.id || idx} className={`border rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow relative ${profile.laMacDinh ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                  {profile.laMacDinh && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Mặc định
                    </span>
                  )}
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 mb-2 truncate" title={profile.hoTen}>
                      {profile.hoTen || 'Chưa cập nhật tên'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-sm text-gray-600">
                      <p><span className="font-medium text-gray-700">Ngày sinh:</span> {profile.ngaysinh || profile.ngaySinh ? new Date(profile.ngaysinh || profile.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'}</p>
                      <p><span className="font-medium text-gray-700">Giới tính:</span> {profile.gioitinh === 0 ? 'Nam' : profile.gioitinh === 1 ? 'Nữ' : 'Khác'}</p>
                      
                      <p><span className="font-medium text-gray-700">Quan hệ:</span> {profile.quanHe || 'N/A'}</p>
                      <p><span className="font-medium text-gray-700">SĐT:</span> {profile.sodienthoai || profile.soDienThoai || 'N/A'}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium text-gray-700">CCCD/CMND:</span> {profile.cmnd || 'N/A'}
                      </p>
                    {(profile.diachi || profile.diaChi) && (
                      <p className="text-sm text-gray-600 mt-1" title={profile.diachi || profile.diaChi}>
                        <span className="font-medium text-gray-700">Địa chỉ:</span> {profile.diachi || profile.diaChi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
