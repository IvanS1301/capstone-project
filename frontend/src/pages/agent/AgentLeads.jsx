import React, { useState, useEffect, useCallback } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import AgentLeadDetails from "../../components/agent/AgentLeadDetails"
import AgentNavbar from '../../components/agent/AgentNavbar'
import AgentSidebar from "../../components/agent/AgentSidebar"

/** --- CONTEXT --- */
import { useLeadsContext } from "../../hooks/useLeadsContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AgentLeads = () => {
  const { unassignedLeads, dispatch } = useLeadsContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [filteredLeads, setFilteredLeads] = useState([]); // State to hold filtered leads

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true); // Start loading when fetching leads
      const response = await fetch(`${URL}/api/leads/unassigned`, {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_UNASSIGNED_LEADS', payload: json })
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
    // Perform any necessary actions to update leads or refetch data
    fetchLeads();
  }, [fetchLeads]);

  // Function to handle search
  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase(); // Convert query to lowercase for case-insensitive search

    if (lowerCaseQuery.trim() === "") {
      setFilteredLeads(unassignedLeads); // If query is empty, show all leads
    } else {
      const filtered = unassignedLeads.filter((lead) => {
        const name = lead.name ? lead.name.toLowerCase() : ''; // Check if lead.name is defined
        const type = lead.type ? lead.type.toLowerCase() : '';
        const emailaddress = lead.emailaddress ? lead.emailaddress.toLowerCase() : '';
        const callDisposition = lead.callDisposition ? lead.callDisposition.toLowerCase() : '';

        return name.includes(lowerCaseQuery) || type.includes(lowerCaseQuery) || callDisposition.includes(lowerCaseQuery) || emailaddress.includes(lowerCaseQuery)
      });
      setFilteredLeads(filtered);
    }
  }, [unassignedLeads]);


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
                  <AgentLeadDetails unassignedLeads={filteredLeads} onLeadUpdate={handleLeadUpdate} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AgentLeads;
