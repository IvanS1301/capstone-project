import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

/** --- MATERIAL UI --- */
import { Container, Typography, Box, Paper, Modal, Backdrop, Fade, Button, Grid } from '@mui/material';

/** --- FOR MODAL --- */
import EditUserLG from '../../pages/profile/EditUserLG';
import AgentStatus from '../../pages/agent/AgentStatus';

/** --- TIME AND DATE FORMAT --- */
import moment from 'moment';

/** --- IMPORT CONTEXT --- */
import { useUsersContext } from "../../hooks/useUsersContext";

// Function to shorten ObjectId
const objectIdToShortId = (objectId) => {
    const hexString = objectId.toString();
    return hexString.substring(17, 26);
};

const ViewUserLG = ({ onUserUpdate }) => {
    const { id } = useParams();
    const { userlgs } = useUsersContext();
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);

    // Find the userlg with the specified ID
    const userlg = userlgs.find(userlg => userlg._id === id);

    if (!userlg) {
        return <Typography>User not found</Typography>; // Or any other appropriate handling
    }

    const formattedBirthday = userlg.birthday ? moment(userlg.birthday).format('YYYY-MM-DD') : '';

    const handleOpenEditModal = () => {
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const handleOpenStatusModal = () => {
        setOpenStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        setOpenStatusModal(false);
    };

    return (
        <Container maxWidth="md">
            <Box display="flex" flexDirection="column" alignItems="center" paddingY={8}>
                <Box display="flex" alignItems="center" width="100%" padding={4}>
                    <Box flexBasis="30%" display="flex" justifyContent="center">
                        <img
                            alt="profile-user"
                            width="200px" // Increased size
                            height="200px" // Increased size
                            src={process.env.PUBLIC_URL + '/icon.png'}
                            className="cursor-pointer rounded-full"
                        />
                    </Box>
                    <Box flexBasis="70%" paddingX={4}>
                        <Typography variant="h3" style={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{userlg.name}</Typography>
                        <Typography variant="h5" color="#065f46" fontWeight="bold" gutterBottom>{userlg.role}</Typography>
                        <Typography variant="body1" color="error" fontWeight="bold" gutterBottom>{userlg.status}</Typography>
                        <Box marginTop={4} display="flex" gap={2}>
                            <Button variant="contained" sx={{ backgroundColor: '#3e4396' }} onClick={handleOpenEditModal}>
                                Update Profile
                            </Button>
                            <Button variant="contained" sx={{ backgroundColor: '#D22B2B' }} onClick={handleOpenStatusModal}>
                                Update Status
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Paper elevation={3} sx={{ padding: 5, borderRadius: 6, boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.065)', backgroundColor: '#072538', width: '100%', marginTop: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Employee ID</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{objectIdToShortId(userlg._id)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Birthday</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{formattedBirthday}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Phone Number</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{userlg.number}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Email</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{userlg.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Address</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{userlg.homeaddress}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6" component="h3" style={{ color: '#94e2cd', marginBottom: '8px' }}>Gender</Typography>
                            <Typography variant="body1" component="p" style={{ color: 'white', fontSize: '1.2rem' }}>{userlg.gender}</Typography>
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
            </Box>
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openEditModal}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <EditUserLG userId={userlg._id} onClose={handleCloseEditModal} onUserUpdate={onUserUpdate}/>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={openStatusModal}
                onClose={handleCloseStatusModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openStatusModal}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <AgentStatus userId={userlg._id} onUserUpdate={onUserUpdate}/>
                    </Box>
                </Fade>
            </Modal>
        </Container >
    );
};

export default ViewUserLG;
