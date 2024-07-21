import React from 'react'
import AgentViewEmail from '../../components/agent/AgentViewEmail'
import AgentSidebar from '../../components/agent/AgentSidebar';

const AgentReadEmail = () => {
    return (
        <div className="flex">
            <AgentSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <div className="p-2">
                    <AgentViewEmail />
                </div>
            </div>
        </div>
    );
}

export default AgentReadEmail
