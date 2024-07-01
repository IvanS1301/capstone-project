import React from 'react'
import AgentUpdateStatus from '../../components/agent/AgentUpdateStatus'

const AgentStatus = ({ userId, onUserUpdate }) => {
    return (
        <div className="EditForm">
            <AgentUpdateStatus userId={userId} onUserUpdate={onUserUpdate} />
        </div>
    );
}

export default AgentStatus