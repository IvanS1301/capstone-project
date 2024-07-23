import { useState, useEffect } from 'react';
import { URL } from "../../utils/URL";

/** --- MATERIAL UI --- */
import { Box, Button, Typography, TextField, CircularProgress, Modal, Grid, MenuItem } from '@mui/material';
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
                width: 900,
                bgcolor: '#f1f1f1',
                border: '2px solid #f1f1f1',
                boxShadow: 24,
                p: 5,
                borderRadius: '30px'
            }}
        >
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" color="#D22B2B" mb={3} fontWeight="medium">
                    Send An Email
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenTemplateModal(true)}
                    >
                        Add New Template
                    </Button>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="From"
                            name="from"
                            value={emailData.from}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('from')}
                            helperText={emptyFields.includes('from') && 'This field is required'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="To"
                            name="to"
                            value={emailData.to}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('to')}
                            helperText={emptyFields.includes('to') && 'This field is required'}
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
                            rows={10}
                            label="Text"
                            name="text"
                            value={emailData.text}
                            onChange={handleChange}
                            margin="normal"
                            error={emptyFields.includes('text')}
                            helperText={emptyFields.includes('text') && 'This field is required'}
                            InputProps={{
                                sx: {
                                    padding: '0.5rem 1rem',
                                    lineHeight: '1.5rem'
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send'}
                    </Button>
                </Box>
                {error && <Grid item xs={12}><div className="error">{error}</div></Grid>}
                <Modal open={openSuccessModal} onClose={handleCloseSuccessModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: '#fff',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            boxShadow: 24
                        }}
                    >
                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>
                            Email sent successfully!
                        </Typography>
                    </Box>
                </Modal>
                <Modal open={openTemplateModal} onClose={() => setOpenTemplateModal(false)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: '#fff',
                            borderRadius: 2,
                            p: 3,
                            width: 400,
                            boxShadow: 24
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
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Text"
                            name="text"
                            value={newTemplate.text}
                            onChange={handleTemplateChange}
                            margin="normal"
                        />
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveTemplate}
                            >
                                Save Template
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </form>
        </Box>
    );
};

export default EmailForm;
