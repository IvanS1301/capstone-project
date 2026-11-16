import { useState, useEffect } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import {
    Box,
    Button,
    Typography,
    TextField,
    CircularProgress,
    Modal,
    Grid,
    MenuItem,
    Paper
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useTemplateContext } from "../../hooks/useTemplateContext";
import { useAuthContext } from "../../hooks/useAuthContext";

/** ==========================================
    EMAIL VALIDATION HELPERS
========================================== */

// Common misspelled email domains
const commonDomainTypos = {
    'gma.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmail.co': 'gmail.com',

    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'yahoo.co': 'yahoo.com',

    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',

    'outlok.com': 'outlook.com',
    'outlook.con': 'outlook.com',
    'outllok.com': 'outlook.com',

    'iclould.com': 'icloud.com',
    'icloud.con': 'icloud.com'
};

// General email format validation
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Check whether an email contains a common domain typo
const getDomainSuggestion = (email) => {
    const domain = email.trim().toLowerCase().split('@')[1];

    return commonDomainTypos[domain] || null;
};

const EmailForm = ({ unassignedId, email, onLeadUpdate }) => {

    const { dispatch } = useEmailsContext();
    const { userLG } = useAuthContext();
    const { templates, dispatch: templateDispatch } = useTemplateContext();

    const [subjectOptions, setSubjectOptions] = useState([]);
    const [textTemplates, setTextTemplates] = useState({});

    const [emailData, setEmailData] = useState({
        from: userLG.email || '',
        to: email || '',
        subject: '',
        text: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openTemplateModal, setOpenTemplateModal] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        subject: '',
        text: ''
    });

    // ==========================================
    // FETCH EMAIL TEMPLATES
    // ==========================================

    useEffect(() => {

        const fetchTemplates = async () => {

            if (!userLG || !userLG.token) return;

            try {

                const response = await fetch(`${URL}/api/templates`, {
                    headers: {
                        'Authorization': `Bearer ${userLG.token}`
                    },
                });

                const templates = await response.json();

                templateDispatch({
                    type: 'SET_TEMPLATES',
                    payload: templates
                });

            } catch (error) {

                console.error('Failed to fetch templates:', error);

            }

        };

        fetchTemplates();

    }, [templateDispatch, userLG]);

    // ==========================================
    // LOAD TEMPLATE OPTIONS
    // ==========================================

    useEffect(() => {

        if (templates) {

            const subjects = templates.map(
                template => template.subject
            );

            const texts = templates.reduce((acc, template) => {

                acc[template.subject] = template.text;

                return acc;

            }, {});

            setSubjectOptions(subjects);
            setTextTemplates(texts);

        }

    }, [templates]);

    // ==========================================
    // UPDATE FROM AND TO FIELDS
    // ==========================================

    useEffect(() => {

        setEmailData(prevData => ({
            ...prevData,
            from: userLG?.email || '',
            to: email || ''
        }));

    }, [email, userLG?.email]);

    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === 'subject') {

            setEmailData(prevData => ({
                ...prevData,
                [name]: value,
                text: textTemplates[value] || prevData.text
            }));

        } else {

            setEmailData(prevData => ({
                ...prevData,
                [name]: value
            }));

        }

        setError(null);

        setEmptyFields(prevFields =>
            prevFields.filter(field => field !== name)
        );

    };

    // ==========================================
    // HANDLE EMAIL SUBMISSION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        setError(null);
        setEmptyFields([]);

        // ==========================================
        // REQUIRED FIELD VALIDATION
        // ==========================================

        const requiredFields = {
            from: 'From',
            to: 'To',
            subject: 'Subject',
            text: 'Text'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([field]) =>
                !String(emailData[field] || '').trim()
            )
            .map(([field]) => field);

        if (missingFields.length > 0) {

            setEmptyFields(missingFields);

            const missingLabels = missingFields.map(
                field => requiredFields[field]
            );

            setError(
                `Please complete the following required fields: ${missingLabels.join(', ')}. Empty or space-only entries are not allowed.`
            );

            return;
        }

        // ==========================================
        // PREPARE CLEAN EMAIL DATA
        // ==========================================

        const cleanedEmailData = {
            from: emailData.from.trim(),
            to: emailData.to.trim(),
            subject: emailData.subject.trim(),
            text: emailData.text.trim()
        };

        // ==========================================
        // CHECK EMAIL FORMAT AND DOMAIN TYPOS
        // ==========================================

        const emailFields = [
            { field: 'from', label: 'From' },
            { field: 'to', label: 'To' }
        ];

        for (const { field, label } of emailFields) {

            const currentEmail = cleanedEmailData[field];

            // Check general email format
            if (!emailRegex.test(currentEmail)) {

                setError(
                    `Please enter a valid email address in the ${label} field.`
                );

                setEmptyFields([field]);

                return;
            }

            // Check common misspelled domains
            const suggestedDomain = getDomainSuggestion(currentEmail);

            if (suggestedDomain) {

                setError(
                    `The ${label} email address has an incorrect domain. Did you mean ${suggestedDomain}? Please check the email address.`
                );

                setEmptyFields([field]);

                return;
            }

        }

        // ==========================================
        // CHECK USER AUTHENTICATION
        // ==========================================

        if (!userLG || !userLG.token) {

            setError('You must be logged in.');

            return;
        }

        setLoading(true);

        try {

            // ==========================================
            // SEND EMAIL REQUEST
            // ==========================================

            const response = await fetch(`${URL}/api/emails/`, {

                method: 'POST',

                body: JSON.stringify(cleanedEmailData),

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userLG.token}`
                }

            });

            const json = await response.json();

            if (!response.ok) {

                setError(
                    json.error || 'Failed to send email. Please try again.'
                );

                setEmptyFields(json.emptyFields || []);

                return;
            }

            // ==========================================
            // SUCCESSFUL EMAIL SUBMISSION
            // ==========================================

            setError(null);
            setEmptyFields([]);
            setOpenSuccessModal(true);

            dispatch({
                type: 'CREATE_EMAIL',
                payload: json
            });

            setTimeout(() => {

                setOpenSuccessModal(false);

                onLeadUpdate();

            }, 2000);

        } catch (error) {

            console.error('Email sending error:', error);

            setError(
                'An error occurred while sending the email.'
            );

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // CLOSE SUCCESS MODAL
    // ==========================================

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    // ==========================================
    // HANDLE NEW TEMPLATE INPUT
    // ==========================================

    const handleTemplateChange = (e) => {

        const { name, value } = e.target;

        setNewTemplate(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    // ==========================================
    // SAVE NEW EMAIL TEMPLATE
    // ==========================================

    const handleSaveTemplate = async () => {

        const cleanedTemplate = {
            subject: newTemplate.subject.trim(),
            text: newTemplate.text.trim()
        };

        // Reject empty or space-only template fields
        if (!cleanedTemplate.subject || !cleanedTemplate.text) {

            setError(
                'Template subject and text are required. Empty or space-only entries are not allowed.'
            );

            return;
        }

        if (!userLG || !userLG.token) {

            setError('You must be logged in.');

            return;
        }

        try {

            const response = await fetch(`${URL}/api/templates`, {

                method: 'POST',

                body: JSON.stringify(cleanedTemplate),

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userLG.token}`
                }

            });

            const template = await response.json();

            if (response.ok) {

                templateDispatch({
                    type: 'CREATE_TEMPLATE',
                    payload: template
                });

                setSubjectOptions(prevOptions => [
                    ...prevOptions,
                    template.subject
                ]);

                setTextTemplates(prevTemplates => ({
                    ...prevTemplates,
                    [template.subject]: template.text
                }));

                setOpenTemplateModal(false);

                setNewTemplate({
                    subject: '',
                    text: ''
                });

                setError(null);

            } else {

                setError(
                    template.error || 'Failed to save email template.'
                );

            }

        } catch (error) {

            console.error('Failed to save template:', error);

            setError('Failed to save email template.');

        }

    };

    // ==========================================
    // COMPONENT UI
    // ==========================================

    return (

        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: 1000,
                bgcolor: '#f0f4f8',
                border: '9px solid #cbd5e1',
                boxShadow: 24,
                p: 5,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                overflow: 'hidden'
            }}
        >

            <Typography variant="h4" color="#333" fontWeight="bold">
                Send An Email
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={2}>

                <Button
                    variant="contained"
                    onClick={() => setOpenTemplateModal(true)}
                    sx={{
                        borderRadius: 1,
                        backgroundColor: "#3e4396"
                    }}
                >
                    Add New Template
                </Button>

            </Box>

            <form onSubmit={handleSubmit}>

                <Grid container spacing={3}>

                    {/* FROM */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="From"
                            name="from"
                            value={emailData.from}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('from')}
                            helperText={
                                emptyFields.includes('from') &&
                                'Please check this email address'
                            }
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    bgcolor: '#e0e0e0'
                                }
                            }}
                        />

                    </Grid>

                    {/* TO */}

                    <Grid item xs={12} sm={6}>

                        <TextField
                            fullWidth
                            label="To"
                            name="to"
                            value={emailData.to}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('to')}
                            helperText={
                                emptyFields.includes('to') &&
                                'Please check this email address'
                            }
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    bgcolor: '#e0e0e0'
                                }
                            }}
                        />

                    </Grid>

                    {/* SUBJECT */}

                    <Grid item xs={12}>

                        <TextField
                            select
                            fullWidth
                            label="Subject"
                            name="subject"
                            value={emailData.subject}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('subject')}
                            helperText={
                                emptyFields.includes('subject') &&
                                'This field is required'
                            }
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    bgcolor: '#e0e0e0'
                                }
                            }}
                        >

                            {subjectOptions.map((option, index) => (

                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>

                            ))}

                        </TextField>

                    </Grid>

                    {/* EMAIL TEXT */}

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            label="Text"
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('text')}
                            helperText={
                                emptyFields.includes('text') &&
                                'This field is required'
                            }
                            InputProps={{
                                sx: {
                                    borderRadius: 1,
                                    bgcolor: '#e0e0e0',
                                    padding: '0.5rem 1rem'
                                }
                            }}
                        />

                    </Grid>

                </Grid>

                {/* SEND BUTTON */}

                <Box mt={4} display="flex" justifyContent="left">

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                            borderRadius: 20,
                            padding: '12px 24px',
                            fontSize: '18px',
                            height: '56px'
                        }}
                    >

                        {loading
                            ? <CircularProgress size={24} />
                            : 'Send'
                        }

                    </Button>

                </Box>

                {/* ERROR MESSAGE */}

                {error && (

                    <Box mt={2} color="error.main">
                        {error}
                    </Box>

                )}

            </form>

            {/* ==========================================
                SUCCESS MODAL
            ========================================== */}

            <Modal
                open={openSuccessModal}
                onClose={handleCloseSuccessModal}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <Paper
                    elevation={5}
                    sx={{
                        padding: '40px',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '90%',
                        textAlign: 'center'
                    }}
                >

                    <CheckCircleIcon
                        color="success"
                        sx={{
                            color: '#4caf50',
                            fontSize: '80px',
                            mb: '30px'
                        }}
                    />

                    <Typography variant="h6" mt={2}>
                        Email sent successfully!
                    </Typography>

                </Paper>

            </Modal>

            {/* ==========================================
                ADD NEW TEMPLATE MODAL
            ========================================== */}

            <Modal
                open={openTemplateModal}
                onClose={() => setOpenTemplateModal(false)}
                className="bounce-in-modal"
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#f0f4f8',
                        borderRadius: 2,
                        p: 6,
                        boxShadow: 24,
                        width: 600
                    }}
                >

                    <Typography variant="h6" mb={2}>
                        Add New Template
                    </Typography>

                    <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={newTemplate.subject}
                        onChange={handleTemplateChange}
                        margin="normal"
                        InputProps={{
                            sx: {
                                borderRadius: 1,
                                bgcolor: '#e0e0e0'
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Text"
                        name="text"
                        value={newTemplate.text}
                        onChange={handleTemplateChange}
                        margin="normal"
                        InputProps={{
                            sx: {
                                borderRadius: 1,
                                bgcolor: '#e0e0e0'
                            }
                        }}
                    />

                    <Box mt={3} display="flex" justifyContent="flex-end">

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveTemplate}
                            sx={{
                                borderRadius: 1
                            }}
                        >
                            Save Template
                        </Button>

                    </Box>

                </Box>

            </Modal>

            {/* ==========================================
                LOADING MODAL
            ========================================== */}

            <Modal
                open={loading}
                aria-labelledby="loading-modal-title"
                aria-describedby="loading-modal-description"
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: '#f1f1f1',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '30px'
                    }}
                >

                    <CircularProgress sx={{ fontSize: 60 }} />

                    <div style={{
                        fontSize: '20px',
                        marginTop: '10px'
                    }}>
                        Sending, please wait...
                    </div>

                </Box>

            </Modal>

        </Box>
    );
};

export default EmailForm;
