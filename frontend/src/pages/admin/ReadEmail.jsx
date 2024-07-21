import React from 'react'
import ViewEmail from '../../components/admin/ViewEmail'
import AdminSidebar from '../../components/admin/AdminSidebar';

const ReadEmail = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <div className="p-2">
                    <ViewEmail />
                </div>
            </div>
        </div>
    );
}

export default ReadEmail
