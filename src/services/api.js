import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  imeout: 10000, 
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

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

export const api = {
  // Auth
  login: (data) => axiosClient.post('/admin/dang-nhap', data), 

  // Dashboard
  getOverview: () => axiosClient.get('/admin/tong-quan'),

  // Bookings
  getBookings: (params) => axiosClient.get('/admin/dang-ky', { params }),
  getBookingDetail: (id) => axiosClient.get(`/admin/dang-ky/${id}`),
  updateBooking: (id, data) => axiosClient.patch(`/admin/dang-ky/${id}`, data),
  changeBookingStatus: (id, data) => axiosClient.patch(`/admin/dang-ky/${id}/trang-thai`, data),


  // Users
  getUsers: (params) => axiosClient.get('/admin/nguoi-dung', { params }),
  getUserDetail: (id) => axiosClient.get(`/admin/nguoi-dung/${id}`),
  changeUserStatus: (id, data) => axiosClient.patch(`/admin/nguoi-dung/${id}/trang-thai`, data),

  // Specialties
  getSpecialties: (params) => axiosClient.get('/admin/chuyen-khoa', { params }),
  createSpecialty: (data) => axiosClient.post('/admin/chuyen-khoa', data),
  updateSpecialty: (mack, data) => axiosClient.put(`/admin/chuyen-khoa/${mack}`, data),
  changeSpecialtyStatus: (mack, data) => axiosClient.patch(`/admin/chuyen-khoa/${mack}/trang-thai`, data),

  // Equipment
  getEquipment: (params) => axiosClient.get('/admin/thiet-bi', { params }),
  createEquipment: (data) => axiosClient.post('/admin/thiet-bi', data),
  updateEquipment: (id, data) => axiosClient.put(`/admin/thiet-bi/${id}`, data),
  changeEquipmentStatus: (id, data) => axiosClient.patch(`/admin/thiet-bi/${id}/trang-thai`, data),

  // Doctors
  getDoctors: (params) => axiosClient.get('/admin/bac-si', { params }),
  getDoctorDetail: (manv) => axiosClient.get(`/admin/bac-si/${manv}`),
  updateDoctorInfo: (manv, data) => axiosClient.put(`/admin/bac-si/${manv}/thong-tin`, data),
  addDoctors: (data) => axiosClient.post('/admin/bac-si', data),
  // Notifications
  sendAllUsersNotification: (data) => axiosClient.post('/thongbao/all-users', data),

  // Lưu ý: Request này method POST nhưng không có body (gửi null), chỉ có query parameters
  scheduleNotification: (params) => axiosClient.post('/thongbao/schedule-delayed', null, { params }),

  getUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const encodedPath = encodeURIComponent(path);

    return `${import.meta.env.VITE_BASE_URL}/file/anh?path=${encodedPath}`;
  }

};
