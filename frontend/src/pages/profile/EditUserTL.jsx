import React from 'react'
import UpdateUserTL from '../../components/profile/UpdateUserTL'

const EditUserTL = ({ userId, onUserUpdate }) => {
    return (
        <div className="EditForm">
            <UpdateUserTL userId={userId} onUserUpdate={onUserUpdate} />
        </div>
    );
}

export default EditUserTL