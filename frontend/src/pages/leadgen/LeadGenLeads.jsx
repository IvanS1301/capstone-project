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

  // ==========================================
  // FETCH LEADS
  // ==========================================
  const fetchLeads = useCallback(async () => {
    if (!userLG || !userLG.token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${URL}/api/leads`, {
        headers: {
          'Authorization': `Bearer ${userLG.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || 'Failed to fetch leads.');
      }

      dispatch({
        type: 'SET_LEADS',
        payload: json,
      });

      setFilteredLeads(json);

    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, userLG]);

  // ==========================================
  // FETCH LEADS ON PAGE LOAD
  // ==========================================
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ==========================================
  // HANDLE LEAD UPDATE
  // ==========================================
  const handleLeadUpdate = useCallback(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ==========================================
  // FETCH USERS
  // ==========================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${URL}/api/userLG`, {
          headers: userLG?.token
            ? {
                'Authorization': `Bearer ${userLG.token}`,
              }
            : {},
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch users.');
        }

        dispatchUsers({
          type: 'SET_USERS',
          payload: json,
        });

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (userLG?.token) {
      fetchUsers();
    }
  }, [dispatchUsers, userLG]);

  // ==========================================
  // HANDLE SEARCH
  // ==========================================
  const handleSearch = useCallback((query) => {
    const lowerCaseQuery = query.toLowerCase().trim();

    if (lowerCaseQuery === "") {
      setFilteredLeads(leads);
      return;
    }

    const filtered = leads.filter((lead) => {

      // Lead name
      const name = lead.name
        ? String(lead.name).toLowerCase()
        : '';

      // Lead type
      const type = lead.type
        ? String(lead.type).toLowerCase()
        : '';

      // Assigned user
      const assignedTo = lead.assignedTo
        ? typeof lead.assignedTo === 'object'
          ? `${lead.assignedTo.firstname || ''} ${lead.assignedTo.lastname || ''} ${lead.assignedTo.email || ''} ${lead.assignedTo._id || ''}`
          : String(lead.assignedTo)
        : '';

      return (
        name.includes(lowerCaseQuery) ||
        type.includes(lowerCaseQuery) ||
        assignedTo.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredLeads(filtered);

  }, [leads]);

  // ==========================================
  // RENDER
  // ==========================================
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
