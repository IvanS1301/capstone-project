import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import moment from 'moment';
import { useLeadsContext } from "../../hooks/useLeadsContext";

const ViewLead = ({ leadId }) => {
  const { tlLeads } = useLeadsContext();

  // Find the lead with the specified ID
  const lead = tlLeads.find(lead => lead._id === leadId);

  if (!lead) {
    return <div>Loading...</div>;
  }

  // Format the createdAt and updatedAt date using moment.js
  const formattedCreatedAt = moment(lead.createdAt).format('MMM-D-YYYY h:mm:ss a');
  const formattedUpdatedAt = moment(lead.updatedAt).format('MMM-D-YYYY h:mm:ss a');
  const formattedDistributed = moment(lead.Distributed).format('MMM-D-YYYY h:mm:ss a');

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 5, borderRadius: 6, boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.065)', backgroundColor: '#041926' }}>

        <Box mb={3} textAlign="center" style={{ backgroundColor: '#9c1c1c', padding: '3px', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', marginTop: '4px' }}>
          <Typography variant="h4" component="h1" gutterBottom style={{ color: '#e0e0e0', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', marginTop: '10px' }}>
            {lead.name}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Type: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Phone Number: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.phonenumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Street Address: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.streetaddress}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>City: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.city}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Postcode: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.postcode}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Email Address: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.emailaddress}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Lead Gen Date: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{formattedCreatedAt}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Distributed: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{formattedDistributed}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Call Disposition: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.callDisposition}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Remarks: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.remarks}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Assigned To: </strong></Typography>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{lead.assignedTo}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" component="p" fontSize="20px" style={{ color: '#94e2cd' }}><strong>Last Touch: </strong></Typography>
            {lead.callDisposition && (
              <Typography variant="body1" component="p" fontSize="20px" style={{ color: 'white' }}>{formattedUpdatedAt}</Typography>
            )}
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

export default ViewLead;