import React from 'react'
import AgentViewEmail from '../../components/agent/AgentViewEmail'

const AgentReadEmail = ({ emailId }) => {
    return (
        <div className="EditForm">
            <AgentViewEmail emailId={emailId} />
        </div>
    );
}

export default AgentReadEmail