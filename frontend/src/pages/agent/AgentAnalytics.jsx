import React, { useEffect, useState } from 'react';
import { URL } from "../../utils/URL";

/** --- COMPONENTS --- */
import AgentSidebar from '../../components/agent/AgentSidebar';
import AgentAnalyticsTabs from "../../components/agent/AgentAnalyticsTabs";

/** --- CONTEXT --- */
import { useServicesContext } from "../../hooks/useServicesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

const AgentAnalytics = () => {
    const { dispatch } = useServicesContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [bookedUnits, setBookedUnits] = useState(null);
    const [userBookedUnits, setUserBookedUnits] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookedUnitsRes] = await Promise.all([
                    fetch(`${URL}/api/services/booked-units-performance`, {
                        headers: { 'Authorization': `Bearer ${userLG.token}` },
                    })
                ]);

                const [bookedUnitsData] = await Promise.all([
                    bookedUnitsRes.json()
                ]);

                if (bookedUnitsRes.ok) {
                    setBookedUnits(bookedUnitsData);
                    dispatch({ type: 'SET_BOOKED_UNITS', payload: bookedUnitsData });
                } else {
                    console.error('Failed to fetch data', { bookedUnitsData });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, userLG]);

    useEffect(() => {
        if (bookedUnits && userLG) {
            const userBooked = bookedUnits.find(booked => booked.telemarketerName === userLG.name);
            setUserBookedUnits(userBooked);
        }
    }, [bookedUnits, userLG]);

    return (
        <div className="flex">
            <AgentSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <div className="p-1 flex-grow flex justify-center items-center">
                    {loading ? (
                        <CircularProgress />
                    ) : (
                            <div className="flex flex-col w-full items-center overflow-y-hidden">
                                <div className="w-full">
                                    <AgentAnalyticsTabs bookedUnits={userBookedUnits} />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AgentAnalytics;
