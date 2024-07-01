import React from 'react'
import UpdateUserAG from '../../components/profile/UpdateUserAG'

const EditUserAG = ({ userId, onUserUpdate }) => {
    return (
        <div className="EditForm">
            <UpdateUserAG userId={userId} onUserUpdate={onUserUpdate} />
        </div>
    );
}

export default EditUserAG
