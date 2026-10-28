LeadGenLeads

import React, { useState, useEffect, useCallback } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import LeadDetails from "../../components/leadgen/LeadDetails";
import LeadGenNavbar from '../../components/leadgen/LeadGenNavbar';
import LeadGenSidebar from "../../components/leadgen/LeadGenSidebar";

/** --- CONTEXT --- */
import { useLeadgenContext } from "../../hooks/useLeadgenContext";
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const LeadGenLeads = () => {
  const { leads, dispatch } = useLeadgenContext();
  const { userlgs, dispatch: dispatchUsers } = useUsersContext();
  const { userLG } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [filteredLeads, setFilteredLeads] = useState([]);

  // Fetch leads and exclude those marked as hidden
  const fetchLeads = useCallback(async () => {
    if (!userLG?.token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${URL}/api/leads`, {
        headers: {
          'Authorization': `Bearer ${userLG.token}`
        }
      });

      const json = await response.json();

      if (response.ok) {
        const visibleLeads = json.filter(
          (lead) => lead.demoHidden !== true
        );

        dispatch({
          type: 'SET_LEADS',
          payload: visibleLeads
        });

        setFilteredLeads(visibleLeads);
      } else {
        console.error('Failed to fetch leads:', json.error);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, userLG]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Refresh leads after an update
  const handleLeadUpdate = useCallback(() => {
    setLoading(true);
    fetchLeads();
  }, [fetchLeads]);

  // Fetch Lead Generation users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${URL}/api/userLG`);
        const json = await response.json();

        if (response.ok) {
          dispatchUsers({
            type: 'SET_USERS',
            payload: json
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dispatchUsers]);

  // Search only among visible leads
  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase().trim();

    const visibleLeads = leads.filter(
      (lead) => lead.demoHidden !== true
    );

    if (lowerCaseQuery === '') {
      setFilteredLeads(visibleLeads);
      return;
    }

    const filtered = visibleLeads.filter((lead) => {
      const name = lead.name
        ? lead.name.toLowerCase()
        : '';

      const type = lead.type
        ? lead.type.toLowerCase()
        : '';

      const assignedTo = lead.assignedTo
        ? String(lead.assignedTo).toLowerCase()
        : '';

      return (
        name.includes(lowerCaseQuery) ||
        type.includes(lowerCaseQuery) ||
        assignedTo.includes(lowerCaseQuery)
      );
    });

    setFilteredLeads(filtered);
  }, [leads]);

  return (
    <div className="flex">
      <LeadGenSidebar />

      <div className="flex flex-col w-full overflow-y-hidden">
        <LeadGenNavbar onSearch={handleSearch} />

        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="flex flex-col w-full items-center overflow-y-hidden">
              <div className="w-full">
                <LeadDetails
                  leads={filteredLeads}
                  userlgs={userlgs}
                  onLeadUpdate={handleLeadUpdate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadGenLeads;
