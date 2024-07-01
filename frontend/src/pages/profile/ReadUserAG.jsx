import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import { URL } from "@utils/URL";

// components
import AgentSidebar from '../../components/agent/AgentSidebar';
import ViewUserAG from '../../components/profile/ViewUserAG'
import { useUsersContext } from "../../hooks/useUsersContext";

const ReadUserAG = () => {
    const { dispatch } = useUsersContext();
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${URL}/api/userLG`);
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USERS', payload: json });
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

    return (
        <div className="flex">
            <AgentSidebar />
            <div className="flex flex-col w-full overflow-y-hidden mt-5">
                <div className="p-1 mt-20">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <CircularProgress />
                        </div>
                    ) : (
                            <ViewUserAG onUserUpdate={handleUserUpdate} />
                        )}
                </div>
            </div>
        </div>
    );
}

export default ReadUserAG
