import axios from 'axios';

const VITE_BASE_URL = 'https://api.personaldev.id.vn';

// 1. Khởi tạo một Axios instance với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Bạn có thể bật tính năng này nếu muốn set timeout cho request
});

// 2. Thiết lập Interceptors

// Interceptor cho request (Có thể dùng để đính kèm Token Auth sau này)
axiosClient.interceptors.request.use(
  (config) => {
    // Ví dụ: const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response (Xử lý data trả về và bắt lỗi chung)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data để giống với behavior của hàm fetch cũ
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// 3. Export các API methods
export const api = {
  // Dashboard
  getOverview: () => axiosClient.get('/api/admin/tong-quan'),

  // Bookings
  getBookings: (params) => axiosClient.get('/api/admin/dang-ky', { params }),
  getBookingDetail: (id) => axiosClient.get(`/api/admin/dang-ky/${id}`),
  updateBooking: (id, data) => axiosClient.patch(`/api/admin/dang-ky/${id}`, data),
  changeBookingStatus: (id, data) => axiosClient.patch(`/api/admin/dang-ky/${id}/trang-thai`, data),
  deleteBooking: (id) => axiosClient.delete(`/api/admin/dang-ky/${id}`),

  // Users
  getUsers: (params) => axiosClient.get('/api/admin/nguoi-dung', { params }),
  getUserDetail: (id) => axiosClient.get(`/api/admin/nguoi-dung/${id}`),
  changeUserStatus: (id, data) => axiosClient.patch(`/api/admin/nguoi-dung/${id}/trang-thai`, data),

  // Specialties
  getSpecialties: (params) => axiosClient.get('/api/admin/chuyen-khoa', { params }),
  createSpecialty: (data) => axiosClient.post('/api/admin/chuyen-khoa', data),
  updateSpecialty: (mack, data) => axiosClient.put(`/api/admin/chuyen-khoa/${mack}`, data),
  changeSpecialtyStatus: (mack, data) => axiosClient.patch(`/api/admin/chuyen-khoa/${mack}/trang-thai`, data),

  // Equipment
  getEquipment: (params) => axiosClient.get('/api/admin/thiet-bi', { params }),
  createEquipment: (data) => axiosClient.post('/api/admin/thiet-bi', data),
  updateEquipment: (id, data) => axiosClient.put(`/api/admin/thiet-bi/${id}`, data),
  changeEquipmentStatus: (id, data) => axiosClient.patch(`/api/admin/thiet-bi/${id}/trang-thai`, data),

  // Doctors
  getDoctors: (params) => axiosClient.get('/api/admin/bac-si', { params }),
  getDoctorDetail: (manv) => axiosClient.get(`/api/admin/bac-si/${manv}`),
  updateDoctorInfo: (manv, data) => axiosClient.put(`/api/admin/bac-si/${manv}/thong-tin`, data),

  // Notifications
  sendAllUsersNotification: (data) => axiosClient.post('/api/thongbao/all-users', data),

  // Lưu ý: Request này method POST nhưng không có body (gửi null), chỉ có query parameters
  scheduleNotification: (params) => axiosClient.post('/api/thongbao/schedule-delayed', null, { params })
};
