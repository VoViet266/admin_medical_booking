import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';
import UserProfileModal from './components/UserProfileModal';

export default function Users() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="space-y-4 relative">
      <UserFilter 
        keyword={keyword}
        setKeyword={setKeyword}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onSearch={handleSearch}
      />

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <UserTable 
        data={data}
        loading={loading}
        toggleStatus={toggleStatus}
        onViewProfiles={(user) => setSelectedUser(user)}
      />

      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
}
