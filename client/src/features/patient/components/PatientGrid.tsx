import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import PatientDetails from './PatientDetails';
import CircularProgress from '@mui/material/CircularProgress';
import { usePatients, usePatientDetails } from '../api';
import { CopilotChat } from '@/features/copilot/components/CopilotChat';

const columns: GridColDef[] = [
  { field: 'subject_id', headerName: 'Subject ID', width: 120 },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'anchor_age', headerName: 'Anchor Age', width: 120 },
  { field: 'anchor_year', headerName: 'Anchor Year', width: 120 },
  { field: 'anchor_year_group', headerName: 'Year Group', width: 140 },
];

export default function PatientGrid() {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [selectedPatientId, setSelectedPatientId] = React.useState<number | null>(null);

  const { data: patientsData, isLoading, error } = usePatients({
    limit: pageSize,
    offset: page * pageSize,
  });

  // Debug logging
  console.log('PatientGrid Debug:', {
    patientsData,
    isLoading,
    error,
    dataLength: patientsData?.data?.length,
    total: patientsData?.total
  });

  const { data: patientDetails, isLoading: detailsLoading } = usePatientDetails({
    patientId: selectedPatientId,
  });

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Patient Data
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ width: 600, flexShrink: 0 }}>
          <Box sx={{ height: 520, width: 600 }}>
            {error ? (
              <Typography color="error" sx={{ mt: 2 }}>{error.message}</Typography>
            ) : (
              <DataGrid
                rows={patientsData?.data || []}
                columns={columns}
                rowCount={patientsData?.total || 0}
                pagination
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
                loading={isLoading}
                getRowId={(row) => row.subject_id ?? row.id ?? row.key ?? Math.random()}
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: 'rgba(33, 150, 243, 0.2) !important', // light blue
                  },
                }}
                onRowClick={(params) => {
                  setSelectedPatientId(params.row.subject_id);
                }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ height: 520, width: '100%' }}>
            <CopilotChat />
          </Box>
        </Box>
      </Box>
      
      {/* Patient Details Section */}
      {selectedPatientId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Patient Details</Typography>
          {detailsLoading ? (
            <CircularProgress />
          ) : patientDetails ? (
            <PatientDetails data={patientDetails} />
          ) : null}
        </Box>
      )}
    </Box>
  );
}
