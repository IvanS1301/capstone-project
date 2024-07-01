import React, { useState, useEffect, useCallback } from 'react';

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import LeadDetails from "../../components/leadgen/LeadDetails"
import LeadGenNavbar from '../../components/leadgen/LeadGenNavbar'
import LeadGenSidebar from "../../components/leadgen/LeadGenSidebar"

/** --- CONTEXT --- */
import { useLeadgenContext } from "../../hooks/useLeadgenContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const LeadGenLeads = () => {
  const { leads, dispatch } = useLeadgenContext()
  const { userlgs, dispatch: dispatchUsers } = useUsersContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [filteredLeads, setFilteredLeads] = useState([]); // State to hold filtered leads

  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_LEADS', payload: json })
        setFilteredLeads(json); // Initialize filteredLeads with all leads initially
      }
      setLoading(false); // Set loading to false when data fetching is complete
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoading(false); // Set loading to false even in case of error
    }
  }, [dispatch, userLG]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Function to handle lead update
  const handleLeadUpdate = useCallback(() => {
    setLoading(true); // Set loading state to true to indicate data fetching
    // Perform any necessary actions to update leads or refetch data
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/userLG')
      const json = await response.json()

      if (response.ok) {
        dispatchUsers({ type: 'SET_USERS', payload: json })
      }
    }

    fetchUsers()
  }, [dispatchUsers])

  // Function to handle search
  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase(); // Convert query to lowercase for case-insensitive search

    if (lowerCaseQuery.trim() === "") {
      setFilteredLeads(leads); // If query is empty, show all leads
    } else {
      const filtered = leads.filter((lead) => {
        const name = lead.name ? lead.name.toLowerCase() : ''; // Check if lead.name is defined
        const type = lead.type ? lead.type.toLowerCase() : '';
        const assignedTo = lead.assignedTo ? lead.assignedTo.toLowerCase() : '';

        return name.includes(lowerCaseQuery) || type.includes(lowerCaseQuery) || assignedTo.includes(lowerCaseQuery)
      });
      setFilteredLeads(filtered);
    }
  }, [leads]);

  return (
    <div className="flex">
      <LeadGenSidebar />
      <div className="flex flex-col w-full overflow-y-hidden">
        <LeadGenNavbar onSearch={handleSearch}/>
        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
              <div className="flex flex-col w-full items-center overflow-y-hidden">
                <div className="w-full">
                  <LeadDetails leads={filteredLeads} userlgs={userlgs} onLeadUpdate={handleLeadUpdate} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default LeadGenLeads;