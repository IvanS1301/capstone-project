import React from 'react'
import ViewEmail from '../../components/admin/ViewEmail'

const ReadEmail = ({ emailId }) => {
    return (
        <div className="EditForm">
            <ViewEmail emailId={emailId} />
        </div>
    );
}

export default ReadEmail