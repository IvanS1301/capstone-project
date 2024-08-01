const Lead = require('../models/leadModel');
const UserLG = require('../models/userLGModel');
const Email = require('../models/emailModel');
const Inventory = require('../models/inventoryModel');
const RecentBooking = require('../models/recentBookingModel');
const moment = require('moment');

// Type and callDisposition enumerations
const typeEnum = ["Warehouse", "Restaurant", "Boutiques", "Salon", "Spa", "Manufacturing", "Hotel", "Gym", "Automotive", "Cafe", "Brewery", "Pet Shops", "Laundry", "Clinic", "Garages", "Mechanics", "Butchery", "Agricultural", "Schools", "Convenience Store", "Business Consultant", "Financing", "Publishing"];
const callDispositionEnum = ["Not Eligible", "Already Installed", "Wrong/Not Working", "Booked", "Residential", "Callback", "Do Not Call", "No Answer", "Not Interested", "Voicemail", "Warm Lead", "Email"];

const updateInventoryCounts = async (dateFilter) => {
    try {
        const filter = {};

        if (dateFilter) {
            const { startDate, endDate } = dateFilter;
            filter.updatedAt = { $gte: startDate, $lte: endDate };
            console.log('Date filter applied:', filter);
        }

        // Log the filter being used
        console.log('Filter for counts:', filter);

        const [
            totalLeads,
            totalUsers,
            totalEmails,
            totalAssignedLeads,
            totalUnassignedLeads,
            typeCountsArray,
            callDispositionCountsArray,
            teamBookedCountsArray,
            numberOfUpdatedLeads
        ] = await Promise.all([
            Lead.countDocuments(filter),
            UserLG.countDocuments(filter),
            Email.countDocuments(filter),
            Lead.countDocuments({ ...filter, assignedTo: { $exists: true } }),
            Lead.countDocuments({ ...filter, assignedTo: { $exists: false } }),
            Promise.all(typeEnum.map(async (type) => ({ type, count: await Lead.countDocuments({ ...filter, type }) }))),
            Promise.all(callDispositionEnum.map(async (disposition) => ({ disposition, count: await Lead.countDocuments({ ...filter, callDisposition: disposition }) }))),
            Promise.all(["Team A", "Team B", "Team C"].map(async (team) => ({ team, count: await RecentBooking.countDocuments({ ...filter, callDisposition: 'Booked', team }) }))),
            Lead.countDocuments({ ...filter, callDisposition: { $exists: true } })
        ]);

        console.log('Counts retrieved:');
        console.log('Total Leads:', totalLeads);
        console.log('Total Users:', totalUsers);
        console.log('Total Emails:', totalEmails);
        console.log('Total Assigned Leads:', totalAssignedLeads);
        console.log('Total Unassigned Leads:', totalUnassignedLeads);
        console.log('Type Counts Array:', typeCountsArray);
        console.log('Call Disposition Counts Array:', callDispositionCountsArray);
        console.log('Team Booked Counts Array:', teamBookedCountsArray);
        console.log('Number of Updated Leads:', numberOfUpdatedLeads);

        const typeCounts = typeCountsArray.reduce((acc, { type, count }) => {
            acc[type] = count;
            return acc;
        }, {});

        const callDispositionCounts = callDispositionCountsArray.reduce((acc, { disposition, count }) => {
            acc[disposition] = count;
            return acc;
        }, {});

        const teamBookedCounts = teamBookedCountsArray.reduce((acc, { team, count }) => {
            acc[team] = count;
            return acc;
        }, { 'Team A': 0, 'Team B': 0, 'Team C': 0 });

        let inventory = await Inventory.findOne();

        if (!inventory) {
            console.log('No inventory found, creating a new one.');
            inventory = new Inventory({
                numberOfLeads: totalLeads,
                numberOfUsers: totalUsers,
                numberOfAssignedLeads: totalAssignedLeads,
                numberOfUnassignedLeads: totalUnassignedLeads,
                numberOfEmails: totalEmails,
                numberOfUpdatedLeads: numberOfUpdatedLeads,
                typeCounts,
                callDispositionCounts,
                teamBookedCounts
            });
        } else {
            console.log('Inventory found, updating existing one.');
            inventory.numberOfLeads = totalLeads;
            inventory.numberOfUsers = totalUsers;
            inventory.numberOfAssignedLeads = totalAssignedLeads;
            inventory.numberOfUnassignedLeads = totalUnassignedLeads;
            inventory.numberOfEmails = totalEmails;
            inventory.numberOfUpdatedLeads = numberOfUpdatedLeads;
            inventory.typeCounts = typeCounts;
            inventory.callDispositionCounts = callDispositionCounts;
            inventory.teamBookedCounts = teamBookedCounts;
        }

        console.log('Saving inventory:', inventory);
        await inventory.save();
        console.log('Inventory saved successfully:', inventory);

        return inventory;

    } catch (error) {
        console.error('Error updating inventory counts:', error);
        throw new Error('Failed to update inventory counts');
    }
};

const getInventory = async (req, res) => {
    try {
        const { range, startDate, endDate } = req.query;
        let filterStartDate, filterEndDate;

        const today = moment().endOf('day');
        if (range === 'daily') {
            filterStartDate = moment().startOf('day');
            filterEndDate = today;
        } else if (range === 'weekly') {
            filterStartDate = moment().startOf('week');
            filterEndDate = today;
        } else if (range === 'monthly') {
            filterStartDate = moment().startOf('month');
            filterEndDate = today;
        } else if (range === 'annually') {
            filterStartDate = moment().startOf('year');
            filterEndDate = today;
        } else if (startDate && endDate) {
            filterStartDate = moment(startDate).startOf('day');
            filterEndDate = moment(endDate).endOf('day');
        } else {
            filterStartDate = null;
            filterEndDate = null;
        }

        const dateFilter = filterStartDate && filterEndDate ? { startDate: filterStartDate.toDate(), endDate: filterEndDate.toDate() } : null;

        console.log('Date filter for inventory:', dateFilter);

        const inventory = await updateInventoryCounts(dateFilter);

        console.log('Inventory response:', inventory);

        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getInventory, updateInventoryCounts };
