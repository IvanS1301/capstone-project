import React from 'react'
import AgentUpdateForm from '../../components/agent/AgentUpdateForm'

const AgentEditForm = ({ unassignedId, onLeadUpdate }) => {
    return (
        <div>
            <AgentUpdateForm unassignedId={unassignedId} onLeadUpdate={onLeadUpdate} />
        </div>
    );
}

export default AgentEditForm