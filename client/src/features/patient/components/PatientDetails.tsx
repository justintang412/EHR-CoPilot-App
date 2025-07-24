import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { PatientDetails } from '../types';

// Helper: Foldable section wrapper
function FoldableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton
          size="small"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography variant="subtitle2" sx={{ ml: 1 }}>{title}</Typography>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Box>
  );
}

// Helper: Render a list of diagnoses or notes (notes as cards)
function ListSection({ title, items, isNotes }: { title: string; items: any[]; isNotes?: boolean }) {
  if (!items?.length) return null;
  if (isNotes) {
    // Render notes as cards in a grid
    return (
      <FoldableSection title={title} defaultOpen={false}>
        <Grid container spacing={2}>
          {items.map((item, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {item.excerpt || item.text || JSON.stringify(item)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </FoldableSection>
    );
  }
  // Diagnoses as chips
  return (
    <FoldableSection title={title} defaultOpen={false}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item, i) => {
          let label: string;
          if (typeof item === 'string' || typeof item === 'number') {
            label = String(item);
          } else if (item && typeof item === 'object') {
            if (item.summary) label = String(item.summary);
            else if (item.text) label = String(item.text);
            else if (item.icd_code) label = `ICD: ${item.icd_code}`;
            else if (item.hadm_id && item.icd_code) label = `hadm: ${item.hadm_id}, ICD: ${item.icd_code}`;
            else label = JSON.stringify(item);
          } else {
            label = '';
          }
          return <Chip key={i} label={label} size="small" />;
        })}
      </Box>
    </FoldableSection>
  );
}

// Helper: Render medications as a table in a grid
function MedicationsSection({ medications }: { medications: any[] }) {
  if (!medications?.length) return null;
  const hiddenColumns = [
    'subject_id',
    'hadm_id',
    'pharmacy_id',
    'poe_id',
    'poe_seq',
    'order_provider_id',
  ];
  const columns = Object.keys(medications[0] || {}).filter(
    (col) => !hiddenColumns.includes(col)
  );
  const sortedMeds = [...medications].sort((a, b) => {
    const aTime = a.starttime ? new Date(a.starttime).getTime() : 0;
    const bTime = b.starttime ? new Date(b.starttime).getTime() : 0;
    return bTime - aTime;
  });
  return (
    <FoldableSection title="Medications" defaultOpen={false}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ maxHeight: 340, overflow: 'auto', minWidth: 600 }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col}>{col}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMeds.map((med, i) => (
                  <TableRow key={med.id || i}>
                    {columns.map((col) => {
                      let value = med[col];
                      if ((col === 'starttime' || col === 'stoptime') && value) {
                        value = String(value).slice(0, 10);
                      }
                      return <TableCell key={col}>{value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Grid>
      </Grid>
    </FoldableSection>
  );
}

// Helper: Render a small table for labs in a grid
function LabsTable({ labs }: { labs: any[] }) {
  if (!labs?.length) return null;
  const columns = Object.keys(labs[0] || {}).filter(
    (k) => k !== 'id' && k !== 'admission_id'
  );
  return (
    <FoldableSection title="Labs" defaultOpen={false}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Table size="small" sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {labs.map((lab, i) => (
                <TableRow key={lab.id || i}>
                  {columns.map((col) => (
                    <TableCell key={col}>{lab[col]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </FoldableSection>
  );
}

// Helper: Render ICU stays with vitals summary in a grid
function ICUStaysSection({ icuStays }: { icuStays: any[] }) {
  if (!icuStays?.length) return null;
  return (
    <FoldableSection title="ICU Stays" defaultOpen={false}>
      <Grid container spacing={2}>
        {icuStays.map((icu, i) => (
          <Grid key={icu.id || i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ mb: 1, pl: 2, borderLeft: '2px solid #eee' }}>
              <CardContent>
                <Typography variant="body2">
                  ICU Stay #{i + 1}: {icu.start_time} - {icu.end_time}
                </Typography>
                {icu.vitals && (
                  <Box sx={{ mt: 0.5, ml: 1 }}>
                    <Typography variant="caption">Vitals: {JSON.stringify(icu.vitals)}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </FoldableSection>
  );
}

// Expandable row for each admission
function AdmissionRow({ admission, isOpen, onToggle }: {
  admission: any;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow
        hover
        selected={isOpen}
        sx={{ cursor: 'pointer', transition: 'background 0.2s' }}
        onClick={onToggle}
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <TableCell>
          <IconButton
            aria-label={isOpen ? 'Collapse details' : 'Expand details'}
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            tabIndex={-1}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{admission.hadm_id}</TableCell>
        <TableCell>{admission.admit_time}</TableCell>
        <TableCell>{admission.discharge_time}</TableCell>
        <TableCell>{admission.admission_type}</TableCell>
        <TableCell>{admission.chief_complaint || ''}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <ListSection title="Diagnoses" items={admission.diagnoses || []} />
              <MedicationsSection medications={admission.medications || []} />
              <LabsTable labs={admission.labs?.slice(0, 5) || []} />
              <ListSection title="Notes" items={admission.notes || []} isNotes />
              <ICUStaysSection icuStays={admission.icu_stays || []} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// Main component
export default function PatientDetails({ data }: { data: PatientDetails }) {
  const [openRow, setOpenRow] = useState<number | null>(null);

  // Enrich admissions with related details by hadm_id
  const admissions = (data.admissions || []).map((admission: any) => ({
    ...admission,
    diagnoses: (data.diagnoses_icd || []).filter((d: any) => d.hadm_id === admission.hadm_id),
    medications: (data.prescriptions || []).filter((m: any) => m.hadm_id === admission.hadm_id),
    labs: (data.labevents || []).filter((l: any) => l.hadm_id === admission.hadm_id),
    notes: (data.discharge || []).filter((n: any) => n.hadm_id === admission.hadm_id),
    icu_stays: (data.icustays || []).filter((i: any) => i.hadm_id === admission.hadm_id),
  }));

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table aria-label="Admissions table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Admission ID</TableCell>
            <TableCell>Admission Time</TableCell>
            <TableCell>Discharge Time</TableCell>
            <TableCell>Admission Type</TableCell>
            <TableCell>Chief Complaint</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admissions.map((admission: any, idx: number) => (
            <AdmissionRow
              key={admission.hadm_id || idx}
              admission={admission}
              isOpen={openRow === idx}
              onToggle={() => setOpenRow(openRow === idx ? null : idx)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 