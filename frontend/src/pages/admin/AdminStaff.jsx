import React, { useState, useEffect, useCallback } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

/** --- COMPONENTS --- */
import LeadGenStats from "../../components/admin/LeadGenStats"
import BookedUnits from "../../components/admin/BookedUnits"
import LeadDistribution from "../../components/admin/LeadDistribution"
import AdminSidebar from "../../components/admin/AdminSidebar"
import AdminNavbar from '../../components/admin/AdminNavbar'

/** --- CONTEXT --- */
import { useServicesContext } from "../../hooks/useServicesContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminStaff = () => {
    const { leadGenStats, bookedUnits, dispatch } = useServicesContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLeadGenStats, setFilteredLeadGenStats] = useState([]);
    const [filteredBookedUnits, setFilteredBookedUnits] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [leadGenRes, bookedUnitsRes] = await Promise.all([
                fetch(`${URL}/api/services/lead-gen-performance`, {
                    headers: { 'Authorization': `Bearer ${userLG.token}` },
                }),
                fetch(`${URL}/api/services/booked-units-performance`, {
                    headers: { 'Authorization': `Bearer ${userLG.token}` },
                })
            ]);

            const [leadGenData, bookedUnitsData] = await Promise.all([
                leadGenRes.json(),
                bookedUnitsRes.json()
            ]);

            if (leadGenRes.ok && bookedUnitsRes.ok) {
                dispatch({ type: 'SET_LEADGEN_STATS', payload: leadGenData });
                dispatch({ type: 'SET_BOOKED_UNITS', payload: bookedUnitsData });
                setFilteredLeadGenStats(leadGenData); // Initialize filteredLeadGenStats with all data
                setFilteredBookedUnits(bookedUnitsData); // Initialize filteredBookedUnits with all data
            } else {
                console.error('Failed to fetch data', { leadGenData, bookedUnitsData });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, userLG]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = useCallback((query) => {
        const lowerCaseQuery = query.toLowerCase();

        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredLeadGenStats(leadGenStats);
            setFilteredBookedUnits(bookedUnits);
        } else {
            const filteredLeadGen = leadGenStats.filter((leadGen) => {
                const leadGenName = leadGen.leadGenName ? leadGen.leadGenName.toLowerCase() : '';
                return leadGenName.includes(lowerCaseQuery);
            });

            const filteredBookedUnits = bookedUnits.filter((unit) => {
                const telemarketerName = unit.telemarketerName ? unit.telemarketerName.toLowerCase() : '';
                return telemarketerName.includes(lowerCaseQuery);
            });

            setFilteredLeadGenStats(filteredLeadGen);
            setFilteredBookedUnits(filteredBookedUnits);
        }
    }, [leadGenStats, bookedUnits]);

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <AdminNavbar onSearch={handleSearch} />
                <div className="p-1 flex-grow flex justify-center items-center">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                            <div className="flex flex-col w-full items-center overflow-y-hidden">
                                <div className="w-full">
                                    <LeadDistribution bookedUnits={searchQuery ? filteredBookedUnits : bookedUnits} />
                                </div>
                                <div className="w-full">
                                    <BookedUnits bookedUnits={searchQuery ? filteredBookedUnits : bookedUnits} />
                                </div>
                                <div className="w-full">
                                    <LeadGenStats leadGenStats={searchQuery ? filteredLeadGenStats : leadGenStats} />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AdminStaff;
