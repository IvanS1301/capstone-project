import React from 'react'
import ViewLeadForm from '../../components/leadgen/ViewLeadForm'

const ReadForm = ({ leadId }) => {
    return (
        <div className="ReadForm">
            <ViewLeadForm leadId={leadId} />
        </div>
    );
}

export default ReadForm