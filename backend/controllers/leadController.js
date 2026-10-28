const Lead = require('../models/leadModel');
const { updateInventoryCounts } = require('./inventoryController');
const RecentBooking = require('../models/recentBookingModel');
const mongoose = require('mongoose');
const { updateLeadGenPerformance } = require('../services/leadGenService');
const { updateBookedUnits } = require('../services/TelemarketerService');
const Notification = require('../models/notificationModel');

/** --- GET ALL LEADS FOR LEAD GENERATION --- */
const getLeads = async (req, res) => {
    try {
        const userLG_id = req.userLG._id;

        const leads = await Lead.find({ userLG_id })
            .sort({ createdAt: -1 });

        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** --- FOR ADMIN/TEAM LEADER ONLY --- */
const getTLLeads = async (req, res) => {
    try {
        const leads = await Lead.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching team leader leads:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** --- LEAD DISTRIBUTION FOR TELEMARKETERS --- */
const getUnassignedLeads = async (req, res) => {
    const userLG_id = req.userLG._id;

    const highPriorityTypes = [
        'Warehouse',
        'Automotive',
        'Cafe',
        'Hotel',
        'Boutiques',
        'Clinic'
    ];

    const lowPriorityTypes = [
        'Schools',
        'Salon',
        'Convenience Store',
        'Agricultural',
        'Gym',
        'Manufacturing',
        'Brewery',
        'Butchery',
        'Pet Shops',
        'Laundry',
        'Restaurant',
        'Spa',
        'Garages',
        'Mechanics',
        'Business Consultant',
        'Financing',
        'Publishing'
    ];

    try {
        let unassignedLeads = await Lead.find({
            assignedTo: userLG_id
        }).exec();

        if (
            unassignedLeads.length === 0 ||
            unassignedLeads.every(lead => lead.callDisposition)
        ) {
            let newLeads = [];

            const fetchLeads = async (types, limit) => {
                return await Lead.find({
                    assignedTo: { $exists: false },
                    demoHidden: { $ne: true },
                    type: { $in: types }
                })
                    .sort({ Distributed: -1 })
                    .limit(limit)
                    .exec();
            };

            const highPriorityLeads = await fetchLeads(
                highPriorityTypes,
                10
            );

            if (highPriorityLeads.length < 10) {
                const remainingCount = 10 - highPriorityLeads.length;

                const lowPriorityLeads = await fetchLeads(
                    lowPriorityTypes,
                    remainingCount
                );

                newLeads = highPriorityLeads.concat(lowPriorityLeads);
            } else {
                newLeads = highPriorityLeads.slice(0, 10);
            }

            if (newLeads.length < 10) {
                const remainingCount = 10 - newLeads.length;

                const additionalLeads = await Lead.find({
                    assignedTo: { $exists: false },
                    demoHidden: { $ne: true },
                    _id: {
                        $nin: newLeads.map(lead => lead._id)
                    }
                })
                    .limit(remainingCount)
                    .sort({ Distributed: -1 })
                    .exec();

                newLeads = newLeads.concat(additionalLeads);
            }

            await Promise.all(
                newLeads.map(async (lead) => {
                    await Lead.findOneAndUpdate(
                        { _id: lead._id },
                        {
                            $set: {
                                assignedTo: userLG_id,
                                Distributed: new Date()
                            }
                        }
                    );
                })
            );

            unassignedLeads = newLeads;
        }

        await updateInventoryCounts();

        res.status(200).json(unassignedLeads);
    } catch (error) {
        console.error('Error distributing leads:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

/** --- GET A SINGLE LEAD --- */
const getSingleLead = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' });
    }

    try {
        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ error: 'No lead found' });
        }

        res.status(200).json(lead);
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** --- CREATE A NEW LEAD --- */
const createLead = async (req, res) => {
    const {
        name,
        type,
        phonenumber,
        streetaddress,
        city,
        postcode,
        emailaddress,
        callDisposition,
        remarks,
        assignedTo
    } = req.body;

    const emptyFields = [];

    if (!name || !name.trim()) {
        emptyFields.push('name');
    }

    if (!type || !type.trim()) {
        emptyFields.push('type');
    }

    if (!streetaddress || !streetaddress.trim()) {
        emptyFields.push('streetaddress');
    }

    if (!city || !city.trim()) {
        emptyFields.push('city');
    }

    if (!postcode || !String(postcode).trim()) {
        emptyFields.push('postcode');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all the fields',
            emptyFields
        });
    }

    try {
        const exists = await Lead.findOne({
            name,
            type,
            phonenumber,
            streetaddress,
            emailaddress
        });

        if (exists) {
            return res.status(400).json({
                error: 'Lead already created'
            });
        }

        const userLG_id = req.userLG._id;

        // Intentional demo behavior:
        // Save the lead in MongoDB but mark it as hidden in the UI.
        const lead = await Lead.create({
            name,
            type,
            phonenumber,
            streetaddress,
            city,
            postcode,
            emailaddress,
            callDisposition,
            remarks,
            userLG_id,
            assignedTo,
            demoHidden: true
        });

        const tasks = [
            updateInventoryCounts(),
            updateLeadGenPerformance(),
            updateBookedUnits(req.userLG.name)
        ];

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

        await Promise.all(tasks);

        res.status(201).json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);

        res.status(400).json({
            error: error.message
        });
    }
};

/** --- DELETE LEAD --- */
const deleteLead = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' });
    }

    try {
        const lead = await Lead.findOneAndDelete({ _id: id });

        if (!lead) {
            return res.status(404).json({ error: 'No lead found' });
        }

        const tasks = [
            updateInventoryCounts(),
            updateLeadGenPerformance(),
            updateBookedUnits(req.userLG.name)
        ];

        await Promise.all(tasks);

        res.status(200).json(lead);
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

/** --- UPDATE LEAD --- */
const updateLead = async (req, res) => {
    const { id } = req.params;
    const { callDisposition } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No lead found' });
    }

    try {
        const lead = await Lead.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!lead) {
            return res.status(404).json({ error: 'No lead found' });
        }

        const tasks = [
            updateInventoryCounts(),
            updateLeadGenPerformance(),
            updateBookedUnits(req.userLG.name)
        ];

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

        await Promise.all(tasks);

        res.status(200).json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);

        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    getLeads,
    getSingleLead,
    createLead,
    deleteLead,
    updateLead,
    getTLLeads,
    getUnassignedLeads
};
