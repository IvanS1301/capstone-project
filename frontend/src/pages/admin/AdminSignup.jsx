import React from 'react';

/** --- COMPONENTS --- */
import AdminSidebar from '../../components/admin/AdminSidebar';
import AddUser from '../../components/admin/AddUser';

const AdminSignup = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden mt-5">
                <div className="p-2 mt-20">
                    <AddUser />
                </div>
            </div>
        </div>
    );
}

export default AdminSignup