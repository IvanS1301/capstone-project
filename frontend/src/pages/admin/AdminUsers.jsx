import React, { useState, useEffect, useCallback } from 'react';

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import UserLists from "../../components/admin/UserLists";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from '../../components/admin/AdminNavbar';

/** --- CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";

const AdminUsers = () => {
  const { userlgs, dispatch } = useUsersContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/userLG');
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_USERS', payload: json });
        setFilteredUsers(json); // Initialize filteredUsers with all users
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserUpdate = useCallback(() => {
    setLoading(true);
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();

    setSearchQuery(query); // Update search query state

    if (query.trim() === "") {
      setFilteredUsers(userlgs); // If query is empty, show all users
    } else {
      const filtered = userlgs.filter((user) => {
        const name = user.name ? user.name.toLowerCase() : ''; // Check if fullName is defined
        const role = user.role ? user.role.toLowerCase() : '';
        const status = user.status ? user.status.toLowerCase() : '';

        return name.includes(lowerCaseQuery) || role.includes(lowerCaseQuery) || status.includes(lowerCaseQuery);
      });
      setFilteredUsers(filtered);
    }
  }, [userlgs]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex flex-col w-full overflow-y-hidden">
        <AdminNavbar onSearch={handleSearch} />
        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
              <div className="flex flex-col w-full items-center overflow-y-hidden">
                <div className="w-full">
                  <UserLists userlgs={searchQuery ? filteredUsers : userlgs} onUserUpdate={handleUserUpdate} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;