import React, { useState } from 'react';
import { usePaginatedPatients, useFullPatientData } from '../api/firebase-functions';
import { Button, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';

export const FirebasePatientGrid: React.FC = () => {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { 
    data: patientsData, 
    isLoading: isLoadingPatients, 
    error: patientsError 
  } = usePaginatedPatients(limit, offset);

  const { 
    data: patientDetails, 
    isLoading: isLoadingDetails, 
    error: detailsError 
  } = useFullPatientData(selectedPatientId || '');

  const handleNextPage = () => {
    setOffset(prev => prev + limit);
  };

  const handlePrevPage = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  if (isLoadingPatients) {
    return (
      <Card>
        <CardContent>
          <CircularProgress />
          <Typography>Loading patients...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (patientsError) {
    return (
      <Alert severity="error">
        Error loading patients: {patientsError.message}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Patients (Firebase Functions)
      </Typography>

      {/* Pagination Controls */}
      <div style={{ marginBottom: '20px' }}>
        <Button 
          onClick={handlePrevPage} 
          disabled={offset === 0}
          variant="outlined"
          style={{ marginRight: '10px' }}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNextPage}
          variant="outlined"
        >
          Next
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          Showing {offset + 1} to {offset + (patientsData?.data?.length || 0)} of {patientsData?.total || 0} patients
        </Typography>
      </div>

      {/* Patients List */}
      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        {patientsData?.data?.map((patient: any) => (
          <Card 
            key={patient.subject_id} 
            style={{ cursor: 'pointer' }}
            onClick={() => handlePatientClick(patient.subject_id)}
          >
            <CardContent>
              <Typography variant="h6">
                Patient ID: {patient.subject_id}
              </Typography>
              <Typography variant="body2">
                Gender: {patient.gender || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Age: {patient.anchor_age || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Details */}
      {selectedPatientId && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Patient Details
            </Typography>
            
            {isLoadingDetails && (
              <CircularProgress size={20} />
            )}

            {detailsError && (
              <Alert severity="error">
                Error loading patient details: {detailsError.message}
              </Alert>
            )}

            {patientDetails && (
              <div>
                <Typography variant="h6">
                  Patient ID: {patientDetails.patient?.subject_id}
                </Typography>
                <Typography variant="body2">
                  Gender: {patientDetails.patient?.gender || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Age: {patientDetails.patient?.anchor_age || 'N/A'}
                </Typography>
                
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                  Admissions: {patientDetails.admissions?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Diagnoses: {patientDetails.diagnoses_icd?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Lab Events: {patientDetails.labevents?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Chart Events: {patientDetails.chartevents?.length || 0}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 