import React, { useState, useEffect, useCallback } from 'react';
import { URL } from "../../../utils/URL";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import AgentEmailList from "../../components/agent/AgentEmailList"
import AgentNavbar from '../../components/agent/AgentNavbar'
import AgentSidebar from "../../components/agent/AgentSidebar"

/** --- CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AgentEmails = () => {
  const { emails, dispatch } = useEmailsContext()
  const { userlgs, dispatch: dispatchUsers } = useUsersContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);

  const fetchEmails = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/api/emails/`, {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_EMAILS_AGENT', payload: json })
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
      const response = await fetch(`${URL}/api/userLG`)
      const json = await response.json()

      if (response.ok) {
        dispatchUsers({ type: 'SET_USERS', payload: json })
      }
    }

    fetchUsers()
  }, [dispatchUsers])

  // Function to handle lead update
  const handleEmailDelete = useCallback(() => {
    setLoading(true); // Set loading state to true to indicate data fetching
    // Perform any necessary actions to update leads or refetch data
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
      <AgentSidebar />
      <div className="flex flex-col w-full overflow-y-hidden">
        <AgentNavbar onSearch={handleSearch} />
        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
              <div className="flex flex-col w-full items-center overflow-y-hidden">
                <div className="w-full">
                  <AgentEmailList emails={searchQuery ? filteredEmails : emails} userlgs={userlgs} onEmailDelete={handleEmailDelete} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AgentEmails;
