const express = require('express')
const {
    getTemplates,
    getSingleTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
} = require('../controllers/templateController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all lead routes
router.use(requireAuth)

/** --- ALL  --- */
router.get('/', getTemplates) // GET all templates
router.get('/:id', getSingleTemplate) // GET a single template
router.post('/', createTemplate) // POST a new template
router.delete('/:id', deleteTemplate) // DELETE template
router.patch('/:id', updateTemplate) // UPDATE template

module.exports = router
