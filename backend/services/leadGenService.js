const LeadGenPerformance = require('../models/leadGenPerformanceModel');
const Lead = require('../models/leadModel');
const UserLG = require('../models/userLGModel');

const getLeadGenPerformance = async (req, res) => {
    try {
        const LeadGenPerformance = await updateLeadGenPerformance()
        res.status(200).json(LeadGenPerformance);
    } catch (error) {
        console.error('Error fetching lead generation performance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLeadGenPerformance = async () => {
    try {
        const leadGenUsers = await UserLG.find({ role: 'Lead Generation' }); // Fetch all Lead Generation users
        const performanceData = [];

        // Define all possible types
        const typeEnum = [
            "Warehouse", "Restaurant", "Boutiques", "Salon", "Spa",
            "Manufacturing", "Hotel", "Gym", "Automotive", "Cafe",
            "Brewery", "Pet Shops", "Laundry", "Clinic", "Garages",
            "Mechanics", "Butchery", "Agricultural", "Schools",
            "Convenience Store", "Business Consultant", "Financing", "Publishing"
        ];

        // Initialize performanceData array with updated lead generation data
        await Promise.all(leadGenUsers.map(async (leadGenUser) => {
            const userLG_id = leadGenUser._id;
            const leadGenName = leadGenUser.name;

            const leadsCreated = await Lead.countDocuments({ userLG_id });
            const leadsAssigned = await Lead.countDocuments({ userLG_id, assignedTo: { $exists: true } });
            const leadsAvailable = leadsCreated - leadsAssigned;

            // Calculate the number of leads created today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const leadsCreatedToday = await Lead.countDocuments({
                userLG_id,
                createdAt: { $gte: today }
            });

            // Count the number of leads created for each type
            const typesCreated = await Lead.aggregate([
                { $match: { userLG_id } },
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]);

            // Convert the result to an object with type as key and count as value
            const typesCreatedObj = typesCreated.reduce((acc, { _id, count }) => {
                acc[_id] = count;
                return acc;
            }, {});

            const performance = await LeadGenPerformance.findOneAndUpdate(
                { leadGenName },
                { leadGenName, leadsCreated, leadsAssigned, leadsAvailable, typesCreated: typesCreatedObj, leadsCreatedToday },
                { upsert: true, new: true }
            );

            performanceData.push(performance);
        }));

        // Sort the performance data by createdAt in descending order
        performanceData.sort((a, b) => b.createdAt - a.createdAt);

        return performanceData;
    } catch (error) {
        console.error('Error updating lead generation performance:', error);
        throw error;
    }
};

module.exports = { getLeadGenPerformance, updateLeadGenPerformance };
