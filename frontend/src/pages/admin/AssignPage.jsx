import React, { useEffect } from 'react';
import AssignLead from '../../components/admin/AssignLead';
import { useUsersContext } from '../../hooks/useUsersContext';

const AssignPage = ({ leadId, onLeadUpdate }) => {
    const { userlgs, dispatch: userDispatch } = useUsersContext();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:4000/api/userLG');
            const json = await response.json();

            if (response.ok) {
                userDispatch({ type: 'SET_USERS', payload: json });
            }
        };

        fetchUsers();
    }, [userDispatch]);

    return (
        <div className="EditForm">
            <AssignLead
                userlgs={userlgs}
                leadId={leadId}  // Pass the leadId prop to AssignLead
                onLeadUpdate={onLeadUpdate}
            />
        </div>
    );
}

export default AssignPage;
