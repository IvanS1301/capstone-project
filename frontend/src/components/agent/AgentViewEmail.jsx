import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { Container, Typography, Box, Paper, Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from 'moment';

const ViewEmail = () => {
    const { id } = useParams(); // Get the id from the URL params
    const { emails } = useEmailsContext();
    const navigate = useNavigate(); // Hook to programmatically navigate
    const email = emails.find(email => email._id === id);

    if (!email) {
        return <div>Loading...</div>;
    }

    // Format the createdAt date using moment.js
    const formattedCreatedAt = moment(email.createdAt).format('MMM D, YYYY h:mm a');

    const handleBack = () => {
        navigate('/AgentEmails'); // Navigate back to the AgentEmails page
    };

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', maxWidth: '2000px', margin: '0 auto' }}>
                {/* Back Button */}
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={handleBack} color="primary">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2" sx={{ ml: 1, color: '#202124' }}>Back to Emails</Typography>
                </Box>

                {/* Email Header */}
                <Box mb={2}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#202124', mb: 2 }}>{email.subject}</Typography>
                    <Typography variant="body1" component="p" sx={{ color: '#5f6368', mb: 1 }}>
                        <strong>From:</strong> {email.from}
                    </Typography>
                    <Typography variant="body1" component="p" sx={{ color: '#5f6368', mb: 2 }}>
                        <strong>To:</strong> {email.to}
                    </Typography>
                    <Typography variant="body2" component="p" sx={{ color: '#9aa0a6' }}>{formattedCreatedAt}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Email Body */}
                <Box sx={{ lineHeight: '1.6', color: '#202124' }}>
                    <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-wrap' }}>{email.text}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Logo and company name */}
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <img
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        alt="logo"
                        style={{ width: '50px', height: '50px', marginRight: '8px' }}
                    />
                    <Typography variant="h6" component="h2" style={{ color: '#020617', fontSize: '1.7rem', marginTop: '2px' }}>Chromagen</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default ViewEmail;
