import React from 'react'
import UpdateLeadForm from '../../components/leadgen/UpdateLeadForm'

const EditForm = ({ leadId, onLeadUpdate }) => {
    return (
        <div>
            <UpdateLeadForm leadId={leadId} onLeadUpdate={onLeadUpdate} />
        </div>
    );
}

export default EditForm