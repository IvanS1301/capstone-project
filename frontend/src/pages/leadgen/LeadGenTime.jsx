import React, { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from "@mui/material";
import { URL } from "../../utils/URL";

/** --- COMPONENTS --- */
import LeadGenStatus from "../../components/leadgen/LeadGenStatus";
import LeadGenNavbar from '../../components/leadgen/LeadGenNavbar';
import LeadGenSidebar from "../../components/leadgen/LeadGenSidebar";

/** --- CONTEXT --- */
import { useServicesContext } from "../../hooks/useServicesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

import moment from 'moment';

const LeadGenTime = () => {
    const { agentstatus, dispatch } = useServicesContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState([]);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`${URL}/api/status/staff`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STAFF_STATUS', payload: json });
                setFilteredStatus(json); // Initialize filteredStatus with all status logs
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching status:', error);
            setLoading(false);
        }
    }, [dispatch, userLG]);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const handleStatusUpdate = useCallback(() => {
        setLoading(true); // Set loading state to true to indicate data fetching
        // Perform any necessary actions to update leads or refetch data
        fetchStatus();
    }, [fetchStatus]);

    const handleSearch = useCallback((query) => {
        const lowerCaseQuery = query.toLowerCase();

        if (query.trim() === "") {
            setFilteredStatus(agentstatus); // If query is empty, show all status logs
        } else {
            const filtered = agentstatus.filter((statusLog) => {
                const employeeName = statusLog.employeeName ? statusLog.employeeName.toLowerCase() : '';
                const role = statusLog.role ? statusLog.role.toLowerCase() : '';
                const status = statusLog.status ? statusLog.status.toLowerCase() : '';
                const createdAtFormatted = statusLog.createdAt
                    ? moment(statusLog.createdAt).format('MMMM Do YYYY').toLowerCase()
                    : '';

                return employeeName.includes(lowerCaseQuery) || role.includes(lowerCaseQuery) || status.includes(lowerCaseQuery) || createdAtFormatted.includes(lowerCaseQuery);
            });
            setFilteredStatus(filtered);
        }
    }, [agentstatus]);

    const handleFilter = useCallback(async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/status/staff?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });
            const json = await response.json();

            if (response.ok) {
                setFilteredStatus(json);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching filtered status:', error);
            setLoading(false);
        }
    }, [userLG]);

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
                                    <LeadGenStatus statuses={filteredStatus} onStatusUpdate={handleStatusUpdate} onFilter={handleFilter} />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default LeadGenTime;
