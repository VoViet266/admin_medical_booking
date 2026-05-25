import { useState } from 'react';
import { api } from '../services/api';
import { Send, Clock } from 'lucide-react';

export default function Notifications() {
  const [allUsersForm, setAllUsersForm] = useState({ tieuDe: '', noiDung: '' });
  const [scheduledForm, setScheduledForm] = useState({ userId: '', tieuDe: '', noiDung: '', delaySeconds: 10 });
  const [loading, setLoading] = useState(false);

  const handleSendAll = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.sendAllUsersNotification(allUsersForm);
      if (res.jobId || res.success) {
        alert('Đã đưa vào hàng đợi gửi thành công (Job ID: ' + res.jobId + ')');
        setAllUsersForm({ tieuDe: '', noiDung: '' });
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.scheduleNotification(scheduledForm);
      if (res.jobId || res.success) {
        alert('Đã lên lịch gửi thành công (Job ID: ' + res.jobId + ')');
        setScheduledForm({ userId: '', tieuDe: '', noiDung: '', delaySeconds: 10 });
      } else {
        alert('Lỗi: ' + res.message);
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Quản lý Thông báo</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Send to All Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Send className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Gửi thông báo toàn hệ thống</h3>
          </div>
          <form onSubmit={handleSendAll} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input 
                required
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
                placeholder="Nhập tiêu đề thông báo..." 
                value={allUsersForm.tieuDe}
                onChange={e => setAllUsersForm({...allUsersForm, tieuDe: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea 
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2" 
                placeholder="Nhập nội dung chi tiết..." 
                value={allUsersForm.noiDung}
                onChange={e => setAllUsersForm({...allUsersForm, noiDung: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Phát thông báo
            </button>
          </form>
        </div>

        {/* Schedule Notification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Clock className="text-indigo-600 w-5 h-5" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Lên lịch gửi cá nhân</h3>
          </div>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Người dùng</label>
                <input 
                  required
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" 
                  placeholder="ID User" 
                  value={scheduledForm.userId}
                  onChange={e => setScheduledForm({...scheduledForm, userId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời gian chờ (giây)</label>
                <input 
                  required
                  type="number" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" 
                  placeholder="VD: 60" 
                  value={scheduledForm.delaySeconds}
                  onChange={e => setScheduledForm({...scheduledForm, delaySeconds: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
              <input 
                required
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" 
                placeholder="Nhập tiêu đề thông báo..." 
                value={scheduledForm.tieuDe}
                onChange={e => setScheduledForm({...scheduledForm, tieuDe: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea 
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2" 
                placeholder="Nhập nội dung chi tiết..." 
                value={scheduledForm.noiDung}
                onChange={e => setScheduledForm({...scheduledForm, noiDung: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Lên lịch gửi
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
