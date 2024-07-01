import React from 'react';

/** --- COMPONENTS --- */
import LeadForm from '../../components/leadgen/LeadForm'
import LeadGenSidebar from '../../components/leadgen/LeadGenSidebar';

const AddForm = () => {
    return (
        <div className="flex">
            <LeadGenSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <div className="p-2">
                    <LeadForm />
                </div>
            </div>
        </div>
    );
}

export default AddForm
