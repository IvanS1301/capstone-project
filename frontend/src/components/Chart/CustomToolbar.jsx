import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';

const CustomToolbar = () => {
    return (
        <GridToolbarContainer sx={{ display: 'flex', gap: '10px', mb: 2 }}>
            <Tooltip title="Columns">
                <Box
                    sx={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1f2937',
                        },
                        boxShadow: 'none',
                        p: 1,
                        '& .MuiSvgIcon-root': {
                            color: '#e0e0e0',  // Ensuring icon color is white
                        }
                    }}
                >
                    <GridToolbarColumnsButton sx={{ color: 'inherit' }} />
                </Box>
            </Tooltip>
            <Tooltip title="Filter">
                <Box
                    sx={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1f2937',
                        },
                        boxShadow: 'none',
                        p: 1,
                        '& .MuiSvgIcon-root': {
                            color: '#e0e0e0',  // Ensuring icon color is white
                        }
                    }}
                >
                    <GridToolbarFilterButton sx={{ color: 'inherit' }} />
                </Box>
            </Tooltip>
            <Tooltip title="Density">
                <Box
                    sx={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1f2937',
                        },
                        boxShadow: 'none',
                        p: 1,
                        '& .MuiSvgIcon-root': {
                            color: '#e0e0e0',  // Ensuring icon color is white
                        }
                    }}
                >
                    <GridToolbarDensitySelector sx={{ color: 'inherit' }} />
                </Box>
            </Tooltip>
            <Tooltip title="Export">
                <Box
                    sx={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1f2937',
                        },
                        boxShadow: 'none',
                        p: 1,
                        '& .MuiSvgIcon-root': {
                            color: '#e0e0e0',  // Ensuring icon color is white
                        }
                    }}
                >
                    <GridToolbarExport sx={{ color: 'inherit' }} />
                </Box>
            </Tooltip>
        </GridToolbarContainer>
    );
};

export default CustomToolbar;
