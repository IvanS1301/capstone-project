import React from 'react';
import { useEmailsContext } from "../../hooks/useEmailsContext";
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import moment from 'moment';

const ViewEmail = ({ emailId }) => {
    const { emails } = useEmailsContext();

    // Find the email with the specified ID
    const email = emails.find(email => email._id === emailId);

    if (!email) {
        return <div>Loading...</div>;
    }

    // Format the createdAt date using moment.js
    const formattedCreatedAt = moment(email.createdAt).format('MMM-D-YYYY h:mm:ss a');

    return (
        <Container>
            <Paper elevation={3} sx={{ padding: 5, borderRadius: 6, boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.065)', backgroundColor: '#041926' }}>

                <Box mb={3} textAlign="center" style={{ backgroundColor: '#9c1c1c', padding: '3px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', marginTop: '4px' }}>
                    <Typography variant="h4" component="h1" gutterBottom style={{ color: '#e0e0e0', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', marginTop: '10px', marginLeft: '5px' }}>
                        {email.subject}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>From: </strong></Typography>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{email.from}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>To: </strong></Typography>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{email.to}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Text: </strong></Typography>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{email.text}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Created At: </strong></Typography>
                        <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{formattedCreatedAt}</Typography>
                    </Grid>
                </Grid>

                {/* Logo and company name */}
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <img
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        alt="logo"
                        style={{ width: '50px', height: '50px', marginRight: '8px' }}
                    />
                    <Typography variant="h6" component="h2" style={{ color: '#e0e0e0', fontSize: '1.7rem', marginTop: '2px' }}>Chromagen</Typography>
                </Box>

            </Paper>
        </Container >
    );
};

export default ViewEmail;