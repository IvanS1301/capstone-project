import React from 'react'
import UpdateUserForm from '../../components/profile/UpdateUserForm'

const EditUserInfo = ({ userId, onUserUpdate }) => {
    return (
        <div className="EditForm">
            <UpdateUserForm userId={userId} onUserUpdate={onUserUpdate} />
        </div>
    );
}

export default EditUserInfo