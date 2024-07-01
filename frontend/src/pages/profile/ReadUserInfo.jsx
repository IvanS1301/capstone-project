import React from 'react'

// components
import ViewUserInfo from '../../components/profile/ViewUserInfo'

const ReadUserInfo = ({ userId }) => {

    return (
        <div>
            <ViewUserInfo userId={userId}/>
        </div>
    );
}

export default ReadUserInfo