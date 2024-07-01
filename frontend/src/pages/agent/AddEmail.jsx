import React from 'react';

/** --- COMPONENTS --- */
import EmailForm from '../../components/agent/EmailForm'
import AgentSidebar from '../../components/agent/AgentSidebar';

const AddEmail = () => {
    return (
        <div className="flex">
            <AgentSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <div className="p-2">
                    <EmailForm />
                </div>
            </div>
        </div>
    );
}

export default AddEmail
