const Template = require('../models/templateModel');
const mongoose = require('mongoose')

/** --- GET ALL TEMPLATES FOR TELEMARKETER --- */
const getTemplates = async (req, res) => {
    const userLG_id = req.userLG._id

    try {
        const templates = await Template.find({ userLG_id }).sort({ createdAt: -1 })
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};

/** --- GET A SINGLE TEMPLATE --- */
const getSingleTemplate = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No template found' })
    }

    const template = await Template.findById(id)

    if (!template) {
        return res.status(404).json({ error: "No template found" })
    }

    res.status(200).json(template)
}

/** --- CREATE A TEMPLATE --- */
const createTemplate = async (req, res) => {
    const { subject, text } = req.body;
    try {
        const userLG_id = req.userLG._id
        const newTemplate = new Template({ subject, text, userLG_id });
        await newTemplate.save();
        res.status(201).json(newTemplate);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create template' });
    }
};

/** --- UPDATE A TEMPLATE --- */
const updateTemplate = async (req, res) => {
    const { id } = req.params;
    const { subject, text } = req.body;
    try {
        const updatedTemplate = await Template.findByIdAndUpdate(id, { subject, text }, { new: true });
        res.json(updatedTemplate);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update template' });
    }
};

const deleteTemplate = async (req, res) => {
    const { id } = req.params;
    try {
        await Template.findByIdAndDelete(id);
        res.json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete template' });
    }
};

module.exports = {
    getTemplates,
    getSingleTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
}
