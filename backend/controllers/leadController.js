const Lead = require('../models/leadModel')
const { updateInventoryCounts } = require('./inventoryController')
const RecentBooking = require('../models/recentBookingModel')
const mongoose = require('mongoose')
const { updateLeadGenPerformance } = require('../services/leadGenService'); // Import the service
const { updateBookedUnits } = require('../services/TelemarketerService'); // Import the service
const Notification = require('../models/notificationModel');

/** --- GET ALL LEADS FOR LEAD GENERATION --- */
const getLeads = async (req, res) => {
    const userLG_id = req.userLG._id

    const leads = await Lead.find({ userLG_id }).sort({ createdAt: -1 })

    res.status(200).json(leads)
}

/** --- FOR ADMIN/TEAM LEADER ONLY --- */
const getTLLeads = async (req, res) => {

    const leads = await Lead.find({}).sort({ createdAt: -1 })

    res.status(200).json(leads)
}

/** --- LEAD DISTRIBUTION FOR TELEMARKETERS --- */
const getUnassignedLeads = async (req, res) => {
    const userLG_id = req.userLG._id;

    const highPriorityTypes = ['Warehouse', 'Automotive', 'Cafe', 'Hotel', 'Boutiques', 'Clinic'];
    const lowPriorityTypes = ['Schools', 'Salon', 'Convenience Store', 'Agricultural', 'Gym', 'Manufacturing', 'Brewery', 'Butchery', 'Pet Shops', 'Laundry', 'Restaurant', 'Spa', 'Garages', 'Mechanics', 'Business Consultant', 'Financing', 'Publishing'];

    try {
        // Check if there are any unassigned leads assigned to the current Telemarketer
        let unassignedLeads = await Lead.find({ assignedTo: userLG_id }).exec();

        // If there are no assigned leads or all assigned leads have been updated, fetch new unassigned leads and assign them to the Telemarketer
        if (unassignedLeads.length === 0 || unassignedLeads.every(lead => lead.callDisposition && lead.remarks)) {
            let newLeads = [];

            const fetchLeads = async (types, limit) => {
                const leads = await Lead.find({ assignedTo: { $exists: false }, type: { $in: types } })
                    .sort({ Distributed: -1 })
                    .limit(limit)
                    .exec();
                return leads;
            };

            // Fetch high-priority leads first
            const highPriorityLeads = await fetchLeads(highPriorityTypes, 10);

            if (highPriorityLeads.length < 10) {
                // Fetch low-priority leads if high-priority leads are not enough
                const remainingCount = 10 - highPriorityLeads.length;
                const lowPriorityLeads = await fetchLeads(lowPriorityTypes, remainingCount);

                // Combine high-priority and low-priority leads
                newLeads = highPriorityLeads.concat(lowPriorityLeads);
            } else {
                newLeads = highPriorityLeads.slice(0, 10); // Ensure exactly 10 leads if high-priority leads are sufficient
            }

            // If we still don't have enough leads, fetch additional leads to make up the difference
            if (newLeads.length < 10) {
                const remainingCount = 10 - newLeads.length;
                const additionalLeads = await Lead.find({ assignedTo: { $exists: false }, _id: { $nin: newLeads.map(lead => lead._id) } })
                    .limit(remainingCount)
                    .sort({ Distributed: -1 })
                    .exec();
                newLeads = newLeads.concat(additionalLeads);
            }

            // Assign fetched leads to the current Telemarketer
            await Promise.all(newLeads.map(async (lead) => {
                await Lead.findOneAndUpdate({ _id: lead._id }, { $set: { assignedTo: userLG_id, Distributed: new Date() } });
            }));

            unassignedLeads = newLeads;
        }

        // Update inventory after distribution
        await updateInventoryCounts();

        // Send the list of unassigned leads assigned to the Telemarketer as the response
        res.status(200).json(unassignedLeads);
    } catch (error) {
        // Handle any errors and send an error response
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** --- GET A SINGLE LEAD --- */
const getSingleLead = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' })
    }

    const lead = await Lead.findById(id)

    if (!lead) {
        return res.status(404).json({ error: "No lead found" })
    }

    res.status(200).json(lead)
}

/** --- CREATE A NEW LEAD --- */
const createLead = async (req, res) => {
    const { name, type, phonenumber, streetaddress, city, postcode, emailaddress, callDisposition, remarks, assignedTo } = req.body

    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!type) {
        emptyFields.push('type')
    }
    if (!phonenumber) {
        emptyFields.push('phonenumber')
    }
    if (!streetaddress) {
        emptyFields.push('streetaddress')
    }
    if (!city) {
        emptyFields.push('city')
    }
    if (!postcode) {
        emptyFields.push('postcode')
    }
    if (!emailaddress) {
        emptyFields.push('emailaddress')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    // add doc to db
    try {
        const exists = await Lead.findOne({ name, type, phonenumber, streetaddress, emailaddress })

        if (exists) {
            throw Error('Lead already created')
        }

        const userLG_id = req.userLG._id
        const lead = await Lead.create({ name, type, phonenumber, streetaddress, city, postcode, emailaddress, callDisposition, remarks, userLG_id, assignedTo })

        // Parallelize non-dependent operations
        const tasks = [updateInventoryCounts(), updateLeadGenPerformance(), updateBookedUnits(req.userLG.name)];

        // Add recent booking if callDisposition is 'Booked'
        if (callDisposition === 'Booked') {
            const recentBooking = new RecentBooking({
                telemarketerName: req.userLG.name,
                callDisposition: 'Booked',
                lead: lead._id,
                leadName: lead.name,
                team: req.userLG.team
            });
            tasks.push(recentBooking.save());
        }

        // Wait for all tasks to complete
        await Promise.all(tasks);

        res.status(200).json(lead)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

/** --- DELETE LEAD --- */
const deleteLead = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' })
    }

    const lead = await Lead.findOneAndDelete({ _id: id })

    if (!lead) {
        return res.status(400).json({ error: 'No lead found' })
    }

    // Update inventory after deleting lead
    await updateInventoryCounts()

    // Update lead generation performance
    await updateLeadGenPerformance();

    // Update BookedUnits
    await updateBookedUnits(req.userLG.name);

    res.status(200).json(lead)

}

/** --- UPDATE LEAD --- */
const updateLead = async (req, res) => {
    const { id } = req.params
    const { callDisposition } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' })
    }

    try {
        const lead = await Lead.findOneAndUpdate({ _id: id }, {
            ...req.body
        }, { new: true })

        if (!lead) {
            return res.status(400).json({ error: 'No lead found' })
        }

        // Parallelize non-dependent operations
        const tasks = [updateInventoryCounts(), updateLeadGenPerformance(), updateBookedUnits(req.userLG.name)];

        // Add recent booking and notification if callDisposition is 'Booked'
        if (callDisposition === 'Booked') {
            const recentBooking = new RecentBooking({
                telemarketerName: req.userLG.name,
                callDisposition: 'Booked',
                lead: lead._id,
                leadName: lead.name,
                team: req.userLG.team
            });
            tasks.push(recentBooking.save());

            const notification = new Notification({
                message: `Lead: ${lead.name} has been booked by ${req.userLG.name}.`
            });
            tasks.push(notification.save());
        }

        // Wait for all tasks to complete
        await Promise.all(tasks);

        res.status(200).json(lead)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getLeads,
    getSingleLead,
    createLead,
    deleteLead,
    updateLead,
    getTLLeads,
    getUnassignedLeads
}
