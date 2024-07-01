import React, { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from "@mui/material";
import { URL } from "../../utils/URL";

/** --- COMPONENTS --- */
import Bookings from "../../components/admin/Bookings"
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from "../../components/admin/AdminSidebar"

/** --- CONTEXT --- */
import { useAdminContext } from "../../hooks/useAdminContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminBookings = () => {
  const { recentBookings, dispatch } = useAdminContext();
  const { userLG } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/api/bookings/recent-bookings`, {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_BOOKINGS', payload: json });
        setFilteredBookings(json); // Initialize filteredBookings with all bookings
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  }, [dispatch, userLG]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleBookingDelete = useCallback(() => {
    setLoading(true);
    fetchBookings();
  }, [fetchBookings]);

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
                  <Bookings recentBookings={searchQuery ? filteredBookings : recentBookings} onLeadDelete={handleBookingDelete} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminBookings;
