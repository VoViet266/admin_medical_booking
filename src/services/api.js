import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  
  timeout: 10000,
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;           // đang gọi refresh hay chưa
let pendingQueue = [];              // các request đang chờ token mới

const processQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  pendingQueue = [];
};

const forceLogout = () => {
  localStorage.removeItem('token');
  window.location.replace('/login');
};

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/lam-moi-token')) {
        processQueue(error);
        forceLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/lam-moi-token`,
          {},
          { withCredentials: true }
        );
        
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;
        if (!newToken) {
          console.error("Không tìm thấy accessToken trong response:", res.data);
          throw new Error('Không nhận được token mới');
        }

        localStorage.setItem('token', newToken);
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
      
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);


export const api = {
  // Auth
  login: (data) => axiosClient.post('/admin/dang-nhap', data), 
  Logout: () => axiosClient.post('/auth/dang-xuat'),

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
  scheduleNotification: (params) => axiosClient.post('/thongbao/schedule-delayed', null, { params }),


  ///file
  getUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const encodedPath = encodeURIComponent(path);

    return `${import.meta.env.VITE_BASE_URL}/file/anh?path=${encodedPath}`;
  },
  
  uploadFile: (file, folderName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', folderName);
    return axiosClient.post('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteFile: (filePath) =>
    axiosClient.delete(`/file/anh?path=${filePath}`),

};
