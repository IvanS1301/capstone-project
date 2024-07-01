import React from 'react'
import AgentViewForm from '../../components/agent/AgentViewForm'

const AgentReadForm = ({ unassignedId }) => {
    return (
        <div className="ReadForm">
            <AgentViewForm unassignedId={unassignedId} />
        </div>
    );
}

export default AgentReadForm