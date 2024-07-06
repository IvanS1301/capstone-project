import React, { useState } from 'react'

/** --- MATERIAL UI --- */
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const BookedUnits = ({ bookedUnits }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 1,
            minWidth: 350,
            renderCell: (params) => params.value.slice(20, 26)
        },
        {
            field: "telemarketerName",
            headerName: "Telemarketer",
            flex: 1,
            minWidth: 400,
            cellClassName: "name-column--cell",
        },
        {
            field: "bookedDaily",
            headerName: "Booked Daily",
            flex: 1,
            minWidth: 400,
        },
        {
            field: "bookedMonth",
            headerName: "Booked Month-to-Date",
            flex: 1,
            minWidth: 400,
        },
        {
            field: "totalBooked",
            headerName: "All Time",
            flex: 1,
            minWidth: 300,
            cellClassName: "name-column--cell",
        },
    ];

    return (
        <Box m="20px">
            <Box mb="20px">
                <Typography
                    variant="h4"
                    color="#111827"
                    fontWeight="bold"
                    sx={{ m: "0 0 5px 0", mt: "25px" }}
                >
                    TELEMARKETER PERFORMANCE
            </Typography>
                <Typography variant="h5" color="#111827">
                    Booked Summary
            </Typography>
            </Box>
            <Box
                m="30px 0 0 0"
                height="39vh"
                sx={{
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    color: "#111827",
                    borderTop: `1px solid #525252 !important`,
                    fontWeight: "600"
                  },
                  "& .name-column--cell": {
                    color: "#1d4ed8",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#111827",
                    borderBottom: "none",
                    color: "#e0e0e0",
                    fontSize: "18px",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: "#d1d5db",
                    fontSize: "17px",
                  },
                  "& .MuiDataGrid-headerContainer": {
                    borderTop: "none",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: "#111827",
                    color: "#ffffff",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#ffffff !important", // Ensure the pagination text is white
                  },
                  "& .MuiTablePagination-actions .MuiButtonBase-root": {
                    color: "#ffffff !important", // Ensure the pagination buttons are white
                  },
                  "& .MuiCheckbox-root": {
                    color: `#111827 !important`,
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `#111827 !important`,
                    fontWeight: "800"
                  },
                }}
            >
                <DataGrid
                    rows={bookedUnits}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => {
                        setSelectedRows(newSelection);
                    }}
                    selectionModel={selectedRows}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    getRowId={row => row._id}
                />
            </Box>
        </Box>
    );
};

export default BookedUnits;
