import React, { useState, useEffect, useCallback } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import EmailList from "../../components/admin/EmailList"
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from "../../components/admin/AdminSidebar"

/** --- CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminEmails = () => {
  const { emails, dispatch } = useEmailsContext();
  const { userlgs, dispatch: dispatchUsers } = useUsersContext();
  const { userLG } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);

  const fetchEmails = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/api/emails/tl`, {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_EMAILS', payload: json });
        setFilteredEmails(json); // Initialize filteredEmails with all emails
      }
      setLoading(false); // Set loading to false when data fetching is complete
    } catch (error) {
      console.error('Error fetching email:', error);
      setLoading(false); // Set loading to false even in case of error
    }
  }, [dispatch, userLG]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${URL}/api/userLG`);
      const json = await response.json();

      if (response.ok) {
        dispatchUsers({ type: 'SET_USERS', payload: json });
      }
    };

    fetchUsers();
  }, [dispatchUsers]);

  const handleEmailDelete = useCallback(() => {
    setLoading(true); // Set loading state to true to indicate data fetching
    // Perform any necessary actions to update emails or refetch data
    fetchEmails();
  }, [fetchEmails]);

  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase();

    setSearchQuery(query); // Update search query state

    if (query.trim() === "") {
      setFilteredEmails(emails); // If query is empty, show all emails
    } else {
      const filtered = emails.filter((email) => {
        const from = email.from ? email.from.toLowerCase() : '';
        const to = email.to ? email.to.toLowerCase() : '';

        return from.includes(lowerCaseQuery) || to.includes(lowerCaseQuery);
      });
      setFilteredEmails(filtered);
    }
  }, [emails]);

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
                  <EmailList emails={searchQuery ? filteredEmails : emails} userlgs={userlgs} onEmailDelete={handleEmailDelete} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmails;
