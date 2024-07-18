import React from 'react';

/** --- COMPONENT --- */
import EmailForm from '../../components/agent/EmailForm'

const AddEmail = ({ unassignedId, email, onLeadUpdate }) => {
    return (
        <div>
            <EmailForm unassignedId={unassignedId} email={email} onLeadUpdate={onLeadUpdate} />
        </div>
    );
}

export default AddEmail
