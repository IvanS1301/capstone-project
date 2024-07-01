import React, { useEffect, useState, useCallback } from 'react';
import { URL } from "../../../utils/URL";

/** --- COMPONENTS --- */
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import DashboardTabs from "../../components/admin/DashboardTabs";

/** --- CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

const AdminDashboard = () => {
    const { dispatch } = useAdminContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState(null);
    const [recentBookings, setRecentBookings] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [inventoryRes, bookingsRes] = await Promise.all([
                fetch(`${URL}/api/inventories/inventory`, {
                    headers: { 'Authorization': `Bearer ${userLG.token}` },
                }),
                fetch(`${URL}/api/bookings/recent-bookings`, {
                    headers: { 'Authorization': `Bearer ${userLG.token}` },
                })
            ]);

            const [inventoryData, bookingsData] = await Promise.all([
                inventoryRes.json(),
                bookingsRes.json()
            ]);

            if (inventoryRes.ok && bookingsRes.ok) {
                setInventory(inventoryData);
                setRecentBookings(bookingsData);
                setFilteredBookings(bookingsData); // Initialize filteredBookings with all bookings
                dispatch({ type: 'SET_INVENTORY', payload: inventoryData });
                dispatch({ type: 'SET_BOOKINGS', payload: bookingsData });
            } else {
                console.error('Failed to fetch data', { inventoryData, bookingsData });
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

        setSearchQuery(query); // Update search query state

        if (query.trim() === "") {
            setFilteredBookings(recentBookings); // If query is empty, show all bookings
        } else {
            const filtered = recentBookings.filter((booking) => {
                const telemarketerName = booking.telemarketerName ? booking.telemarketerName.toLowerCase() : '';
                const leadName = booking.leadName ? booking.leadName.toLowerCase() : '';

                return telemarketerName.includes(lowerCaseQuery) || leadName.includes(lowerCaseQuery);
            });
            setFilteredBookings(filtered);
        }
    }, [recentBookings]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <CircularProgress />
                <p className="text-gray-800 text-2xl font-semibold mt-10 justify-center items-center">Loading...</p>
            </div>
        );
    }

    if (!inventory || !recentBookings) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-gray-800 text-2xl font-semibold">Failed to load data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <AdminNavbar onSearch={handleSearch} />
                <div className="p-1 flex-grow flex justify-center items-center">
                    <div className="flex flex-col w-full items-center overflow-y-hidden">
                        <div className="w-full">
                            <DashboardTabs inventory={inventory} recentBookings={searchQuery ? filteredBookings : recentBookings} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
