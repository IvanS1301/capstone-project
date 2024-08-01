import { useState, useEffect } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Typography, TextField, CircularProgress, Modal, Grid, MenuItem, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/** --- IMPORT CONTEXT --- */
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { useTemplateContext } from "../../hooks/useTemplateContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const EmailForm = ({ unassignedId, email, onLeadUpdate }) => {
    const { dispatch } = useEmailsContext();
    const { userLG } = useAuthContext();
    const { templates, dispatch: templateDispatch } = useTemplateContext(); // Use TemplatesContext

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
    const [newTemplate, setNewTemplate] = useState({ subject: '', text: '' });

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`${URL}/api/templates`, {
                    headers: { 'Authorization': `Bearer ${userLG.token}` },
                });
                const templates = await response.json();
                templateDispatch({ type: 'SET_TEMPLATES', payload: templates });
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            }
        };

        fetchTemplates();
    }, [templateDispatch, userLG]);

    useEffect(() => {
        if (templates) {
            const subjects = templates.map(template => template.subject);
            const texts = templates.reduce((acc, template) => {
                acc[template.subject] = template.text;
                return acc;
            }, {});

            setSubjectOptions(subjects);
            setTextTemplates(texts);
        }
    }, [templates]);

    useEffect(() => {
        setEmailData(prevData => ({
            ...prevData,
            from: userLG.email || '',
            to: email || ''
        }));
    }, [email, userLG.email]);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userLG) {
            setError('You must be logged in');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${URL}/api/emails/`, {
                method: 'POST',
                body: JSON.stringify(emailData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userLG.token}`
                }
            });

            const json = await response.json();
            setLoading(false);

            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.emptyFields || []);
            } else {
                setError(null);
                setEmptyFields([]);
                setOpenSuccessModal(true);
                dispatch({ type: 'CREATE_EMAIL', payload: json });
                setTimeout(() => {
                    setOpenSuccessModal(false);
                    onLeadUpdate();
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            setError('An error occurred while sending the email.');
        }
    };

    const handleCloseSuccessModal = () => {
        setOpenSuccessModal(false);
    };

    const handleTemplateChange = (e) => {
        const { name, value } = e.target;
        setNewTemplate(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveTemplate = async () => {
        if (newTemplate.subject && newTemplate.text) {
            try {
                const response = await fetch(`${URL}/api/templates`, {
                    method: 'POST',
                    body: JSON.stringify(newTemplate),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userLG.token}`
                    }
                });

                const template = await response.json();

                if (response.ok) {
                    templateDispatch({ type: 'CREATE_TEMPLATE', payload: template });
                    setSubjectOptions(prevOptions => [...prevOptions, template.subject]);
                    setTextTemplates(prevTemplates => ({
                        ...prevTemplates,
                        [template.subject]: template.text
                    }));
                    setOpenTemplateModal(false);
                    setNewTemplate({ subject: '', text: '' });
                } else {
                    console.error('Failed to save template:', template.error);
                }
            } catch (error) {
                console.error('Failed to save template:', error);
            }
        } else {
            console.log('Subject and text are required');
        }
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', // Increased width
                maxWidth: 1000, // Increased max width
                bgcolor: '#f0f4f8', // Single background color for the entire component
                border: '9px solid #cbd5e1',
                boxShadow: 24,
                p: 5, // Increased padding
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                overflow: 'hidden' // Ensure no overflow or extra white space
            }}
        >
            <Typography variant="h4" color="#333" fontWeight="bold">
                Send An Email
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Button
                    variant="contained"
                    onClick={() => setOpenTemplateModal(true)}
                    sx={{ borderRadius: 1, backgroundColor: "#3e4396" }}
                >
                    Add New Template
                </Button>
            </Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}> {/* Increased spacing */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="From"
                            name="from"
                            value={emailData.from}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('from')}
                            helperText={emptyFields.includes('from') && 'This field is required'}
                            InputProps={{ sx: { borderRadius: 1, bgcolor: '#e0e0e0' } }} // Gray background for input
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="To"
                            name="to"
                            value={emailData.to}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('to')}
                            helperText={emptyFields.includes('to') && 'This field is required'}
                            InputProps={{ sx: { borderRadius: 1, bgcolor: '#e0e0e0' } }} // Gray background for input
                        />
                    </Grid>
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
                            helperText={emptyFields.includes('subject') && 'This field is required'}
                            InputProps={{ sx: { borderRadius: 1, bgcolor: '#e0e0e0' } }} // Gray background for input
                        >
                            {subjectOptions.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={10} // Increased rows
                            label="Text"
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('text')}
                            helperText={emptyFields.includes('text') && 'This field is required'}
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
                <Box mt={4} display="flex" justifyContent="left">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{
                            borderRadius: 20,
                            padding: '12px 24px',  // Increase padding for a larger button
                            fontSize: '18px',      // Increase font size for larger text
                            height: '56px'         // Set a larger height
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send'}
                    </Button>
                </Box>
                {error && (
                    <Box mt={2} color="error.main">
                        {error}
                    </Box>
                )}
            </form>
            <Modal
                open={openSuccessModal}
                onClose={handleCloseSuccessModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paper elevation={5}
                    sx={{ padding: '40px', borderRadius: '16px', maxWidth: '600px', width: '90%', textAlign: 'center' }}
                >
                    <CheckCircleIcon color="success" sx={{ color: '#4caf50', fontSize: '80px', mb: '30px' }} />
                    <Typography variant="h6" mt={2}>
                        Email sent successfully!
                    </Typography>
                </Paper>
            </Modal>
            <Modal open={openTemplateModal} onClose={() => setOpenTemplateModal(false)} className="bounce-in-modal">
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#f0f4f8', // Consistent background color
                        borderRadius: 2,
                        p: 6, // Increased padding
                        boxShadow: 24,
                        width: 600 // Increased width
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
                        InputProps={{ sx: { borderRadius: 1, bgcolor: '#e0e0e0' } }} // Gray background for input
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={6} // Increased rows
                        label="Text"
                        name="text"
                        value={newTemplate.text}
                        onChange={handleTemplateChange}
                        margin="normal"
                        InputProps={{ sx: { borderRadius: 1, bgcolor: '#e0e0e0' } }} // Gray background for input
                    />
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveTemplate}
                            sx={{ borderRadius: 1 }}
                        >
                            Save Template
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                    <div style={{ fontSize: '20px', marginTop: '10px' }}>Sending, please wait...</div>
                </Box>
            </Modal>
        </Box>
    );
};

export default EmailForm;
