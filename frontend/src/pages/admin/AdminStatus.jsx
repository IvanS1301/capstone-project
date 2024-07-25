import React, { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from "@mui/material";
import { URL } from "../../utils/URL";

/** --- COMPONENTS --- */
import StatusLists from "../../components/admin/StatusLists";
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSidebar from "../../components/admin/AdminSidebar";

/** --- CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuthContext } from "../../hooks/useAuthContext";

import moment from 'moment';

const AdminStatus = () => {
    const { status, dispatch } = useAdminContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState([]);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`${URL}/api/status/status-logs`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_STATUS', payload: json });
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
            setFilteredStatus(status); // If query is empty, show all status logs
        } else {
            const filtered = status.filter((statusLog) => {
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
    }, [status]);

    const handleFilter = useCallback(async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await fetch(`${URL}/api/status/status-logs?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
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
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <AdminNavbar onSearch={handleSearch} />
                <div className="p-1 flex-grow flex justify-center items-center">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                            <div className="flex flex-col w-full items-center overflow-y-hidden">
                                <div className="w-full">
                                    <StatusLists statuses={filteredStatus} onStatusUpdate={handleStatusUpdate} onFilter={handleFilter} />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AdminStatus;
