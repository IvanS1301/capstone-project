const Lead = require('../models/leadModel');
const UserLG = require('../models/userLGModel');
const Email = require('../models/emailModel');
const Inventory = require('../models/inventoryModel');
const RecentBooking = require('../models/recentBookingModel')

// type and callDisposition enumerations
const typeEnum = ["Warehouse", "Restaurant", "Boutiques", "Salon", "Spa", "Manufacturing", "Hotel", "Gym", "Automotive", "Cafe", "Brewery", "Pet Shops", "Laundry", "Clinic", "Garages", "Mechanics", "Butchery", "Agricultural", "Schools", "Convenience Store", "Business Consultant", "Financing", "Publishing"];
const callDispositionEnum = ["Not Eligible", "Already Installed", "Wrong/Not Working", "Booked", "Residential", "Callback", "Do Not Call", "No Answer", "Not Interested", "Voicemail", "Warm Lead", "Email"];

const updateInventoryCounts = async () => {
    try {
        const [
            totalLeads,
            totalUsers,
            totalEmails,
            totalAssignedLeads,
            totalUnassignedLeads,
            typeCountsArray,
            callDispositionCountsArray,
            teamBookedCountsArray
        ] = await Promise.all([
            Lead.countDocuments(),
            UserLG.countDocuments(),
            Email.countDocuments(),
            Lead.countDocuments({ assignedTo: { $exists: true } }),
            Lead.countDocuments({ assignedTo: { $exists: false } }),
            Promise.all(typeEnum.map(async (type) => ({ type, count: await Lead.countDocuments({ type }) }))),
            Promise.all(callDispositionEnum.map(async (disposition) => ({ disposition, count: await Lead.countDocuments({ callDisposition: disposition }) }))),
            Promise.all(["Team A", "Team B", "Team C"].map(async (team) => ({ team, count: await RecentBooking.countDocuments({ callDisposition: 'Booked', team }) }))),
        ]);

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
            inventory = new Inventory({
                numberOfLeads: totalLeads,
                numberOfUsers: totalUsers,
                numberOfAssignedLeads: totalAssignedLeads,
                numberOfUnassignedLeads: totalUnassignedLeads,
                numberOfEmails: totalEmails,
                typeCounts,
                callDispositionCounts,
                teamBookedCounts
            });
        } else {
            inventory.numberOfLeads = totalLeads;
            inventory.numberOfUsers = totalUsers;
            inventory.numberOfAssignedLeads = totalAssignedLeads;
            inventory.numberOfUnassignedLeads = totalUnassignedLeads;
            inventory.numberOfEmails = totalEmails;
            inventory.typeCounts = typeCounts;
            inventory.callDispositionCounts = callDispositionCounts;
            inventory.teamBookedCounts = teamBookedCounts;
        }

        await inventory.save();
        return inventory;

    } catch (error) {
        console.error('Error updating inventory counts:', error);
        throw new Error('Failed to update inventory counts');
    }
};

const getInventory = async (req, res) => {
    try {
        const inventory = await updateInventoryCounts();
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getInventory, updateInventoryCounts };
