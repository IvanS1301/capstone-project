import React from 'react'
import ViewLead from '../../components/admin/ViewLead'

const ReadLead = ({ leadId }) => {
    return (
        <div className="EditForm">
            <ViewLead leadId={leadId} />
        </div>
    );
}

export default ReadLead