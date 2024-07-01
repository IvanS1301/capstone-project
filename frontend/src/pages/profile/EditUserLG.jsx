import React from 'react'
import UpdateUserLG from '../../components/profile/UpdateUserLG'

const EditUserLG = ({ userId, onUserUpdate }) => {
    return (
        <div className="EditForm">
            <UpdateUserLG userId={userId} onUserUpdate={onUserUpdate}/>
        </div>
    );
}

export default EditUserLG