const LeadGenPerformance = require('../models/leadGenPerformanceModel');
const Lead = require('../models/leadModel');
const UserLG = require('../models/userLGModel');

const getLeadGenPerformance = async (req, res) => {
    try {
        const leadGenPerformance = await updateLeadGenPerformance();
        res.status(200).json(leadGenPerformance);
    } catch (error) {
        console.error('Error fetching lead generation performance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLeadGenPerformance = async () => {
    try {
        const leadGenUsers = await UserLG.find({ role: 'Lead Generation' });
        const performanceData = [];

        const typeEnum = [
            "Warehouse", "Restaurant", "Boutiques", "Salon", "Spa",
            "Manufacturing", "Hotel", "Gym", "Automotive", "Cafe",
            "Brewery", "Pet Shops", "Laundry", "Clinic", "Garages",
            "Mechanics", "Butchery", "Agricultural", "Schools",
            "Convenience Store", "Business Consultant", "Financing", "Publishing"
        ];

        await Promise.all(leadGenUsers.map(async (leadGenUser) => {
            const userLG_id = leadGenUser._id;
            const leadGenName = leadGenUser.name;

            // Initialize typesCreatedObj with all types from typeEnum
            const typesCreatedObj = {};
            typeEnum.forEach(type => {
                typesCreatedObj[type] = 0;
            });

            // Fetch all leads created by the user
            const leadsCreated = await Lead.find({ userLG_id });

            // Update typesCreatedObj with actual counts
            leadsCreated.forEach(lead => {
                if (lead.type && typesCreatedObj.hasOwnProperty(lead.type)) {
                    typesCreatedObj[lead.type]++;
                }
            });

            const leadsAssigned = await Lead.countDocuments({ userLG_id, assignedTo: { $exists: true } });
            const leadsAvailable = leadsCreated.length - leadsAssigned;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const leadsCreatedToday = leadsCreated.filter(lead => lead.createdAt >= today).length;

            const performance = await LeadGenPerformance.findOneAndUpdate(
                { leadGenName },
                { leadGenName, leadsCreated: leadsCreated.length, leadsAssigned, leadsAvailable, typesCreated: typesCreatedObj, leadsCreatedToday },
                { upsert: true, new: true }
            );

            performanceData.push(performance);
        }));

        performanceData.sort((a, b) => b.createdAt - a.createdAt);

        return performanceData;
    } catch (error) {
        console.error('Error updating lead generation performance:', error);
        throw error;
    }
};

module.exports = { getLeadGenPerformance, updateLeadGenPerformance };
