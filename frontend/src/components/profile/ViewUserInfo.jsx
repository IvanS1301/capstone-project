import React from 'react';
import { useUsersContext } from "../../hooks/useUsersContext";
import { Container, Typography, Box, Paper } from '@mui/material';
import moment from 'moment';

// Function to shorten ObjectId
const objectIdToShortId = (objectId) => {
    const hexString = objectId.toString();
    return hexString.substring(17, 26);
};

const ViewUserInfo = ({ userId }) => {
    const { userlgs } = useUsersContext();

    // Find the userlg with the specified ID
    const userlg = userlgs.find(userlg => userlg._id === userId);

    if (!userlg) {
        return <Typography>User not found</Typography>; // Or any other appropriate handling
    }

    const formattedBirthday = userlg && userlg.birthday ? moment(userlg.birthday).format('YYYY-MM-DD') : '';

    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Paper elevation={3} sx={{ padding: '40px', borderRadius: 6, boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.065)', backgroundColor: '#111827', maxWidth: '500px', width: '100%' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box mb={4}>
                            <img
                                alt="profile-user"
                                width="150px"
                                height="150px"
                                src={userlg.profileImage || process.env.PUBLIC_URL + '/icon.png'}
                                className="cursor-pointer rounded-full"
                            />
                        </Box>
                        <Typography variant="h4" component="h2" gutterBottom style={{ color: '#e0e0e0', fontWeight: 'bold', marginBottom: '20px' }}>{userlg.name}</Typography>
                        <Typography variant="h6" gutterBottom style={{ color: '#4cceac' }}>{userlg.role}</Typography>
                        <Typography variant="h6" gutterBottom style={{ color: '#ef4444', marginBottom: '30px' }}>{userlg.status}</Typography>
                        <div className="view-details" style={{ textAlign: 'center' }}>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Employee ID: </strong><span style={{ color: 'white' }}>{objectIdToShortId(userlg._id)}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Team: </strong><span style={{ color: 'white' }}>{userlg.team}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Birthday: </strong><span style={{ color: 'white' }}>{formattedBirthday}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Phone Number: </strong><span style={{ color: 'white' }}>{userlg.number}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Email: </strong><span style={{ color: 'white' }}>{userlg.email}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Address: </strong><span style={{ color: 'white' }}>{userlg.homeaddress}</span></Typography>
                            <Typography variant="body1" component="p" fontSize="24px" style={{ color: '#94e2cd', marginBottom: '20px' }}><strong>Gender: </strong><span style={{ color: 'white' }}>{userlg.gender}</span></Typography>
                        </div>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ViewUserInfo;
