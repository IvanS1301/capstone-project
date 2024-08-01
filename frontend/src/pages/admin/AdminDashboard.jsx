import React, { useEffect, useState, useCallback } from 'react';
import { URL } from "../../utils/URL";

/** --- COMPONENTS --- */
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import DashboardTabs from "../../components/admin/DashboardTabs";

/** --- CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** --- MATERIAL UI --- */
import { CircularProgress } from "@mui/material";

import moment from 'moment';

const AdminDashboard = () => {
    const { dispatch } = useAdminContext();
    const { userLG } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState(null);
    const [recentBookings, setRecentBookings] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [timePeriod, setTimePeriod] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const fetchInventoryData = useCallback(async () => {
        try {
            const inventoryRes = await fetch(`${URL}/api/inventories/inventory`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });

            const inventoryData = await inventoryRes.json();

            if (inventoryRes.ok) {
                setInventory(inventoryData);
                dispatch({ type: 'SET_INVENTORY', payload: inventoryData });
            } else {
                console.error('Failed to fetch inventory data', inventoryData);
            }
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    }, [dispatch, userLG]);

    const fetchFilteredInventoryData = useCallback(async (period) => {
        try {
            const inventoryRes = await fetch(`${URL}/api/inventories/inventory?range=${period}`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });

            const inventoryData = await inventoryRes.json();

            if (inventoryRes.ok) {
                setInventory(inventoryData);
                dispatch({ type: 'SET_INVENTORY', payload: inventoryData });
            } else {
                console.error('Failed to fetch inventory data', inventoryData);
            }
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    }, [dispatch, userLG]);

    const fetchDateRangeData = useCallback(async (startDate, endDate) => {
    try {
        // Format dates to ISO 8601 strings
        const formattedStartDate = moment(startDate).toISOString();
        const formattedEndDate = moment(endDate).toISOString();

        const inventoryRes = await fetch(`${URL}/api/inventories/inventory?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
            headers: { 'Authorization': `Bearer ${userLG.token}` },
        });

        const inventoryData = await inventoryRes.json();

        if (inventoryRes.ok) {
            setInventory(inventoryData);
            dispatch({ type: 'SET_INVENTORY', payload: inventoryData });
        } else {
            console.error('Failed to fetch inventory data', inventoryData);
        }
    } catch (error) {
        console.error('Error fetching inventory data:', error);
    }
}, [dispatch, userLG]);

    const fetchBookingsData = useCallback(async () => {
        try {
            const bookingsRes = await fetch(`${URL}/api/bookings/recent-bookings`, {
                headers: { 'Authorization': `Bearer ${userLG.token}` },
            });

            const bookingsData = await bookingsRes.json();

            if (bookingsRes.ok) {
                setRecentBookings(bookingsData);
                setFilteredBookings(bookingsData);
                dispatch({ type: 'SET_BOOKINGS', payload: bookingsData });
            } else {
                console.error('Failed to fetch bookings data', bookingsData);
            }
        } catch (error) {
            console.error('Error fetching bookings data:', error);
        }
    }, [dispatch, userLG]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchInventoryData(), fetchBookingsData()]);
        setLoading(false);
    }, [fetchInventoryData, fetchBookingsData]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleTimePeriodChange = (newPeriod) => {
        setTimePeriod(newPeriod);
        fetchFilteredInventoryData(newPeriod);
        fetchBookingsData(newPeriod, dateRange.startDate, dateRange.endDate);
    };

    const handleDateRangeChange = (range) => {
        setDateRange({ startDate: range.startDate, endDate: range.endDate });
        fetchDateRangeData(range.startDate, range.endDate);
        fetchBookingsData(timePeriod, range.startDate, range.endDate);
    };

    const handleSearch = useCallback((query) => {
        const lowerCaseQuery = query.toLowerCase();

        setSearchQuery(query); // Update search query state

        if (query.trim() === "") {
            setFilteredBookings(recentBookings); // If query is empty, show all bookings
        } else {
            const filtered = recentBookings.filter((booking) => {
                const telemarketerName = booking.telemarketerName ? booking.telemarketerName.toLowerCase() : '';
                const leadName = booking.leadName ? booking.leadName.toLowerCase() : '';
                const createdAtFormatted = booking.createdAt
                    ? moment(booking.createdAt).format('MMMM Do YYYY').toLowerCase()
                    : '';

                return telemarketerName.includes(lowerCaseQuery) || leadName.includes(lowerCaseQuery) || createdAtFormatted.includes(lowerCaseQuery);
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
                            <DashboardTabs
                                inventory={inventory}
                                recentBookings={searchQuery ? filteredBookings : recentBookings}
                                timePeriod={timePeriod}
                                onTimePeriodChange={handleTimePeriodChange}
                                onDateRangeChange={handleDateRangeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
