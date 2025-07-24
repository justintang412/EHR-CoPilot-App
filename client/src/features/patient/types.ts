export interface Patient {
  subject_id: number;
  gender: string;
  anchor_age: number;
  anchor_year: number;
  anchor_year_group: string;
}

export interface PatientsResponse {
  data: Patient[];
  total: number;
}

export interface PatientDetails {
  subject_id: number;
  admissions?: Admission[];
  diagnoses_icd?: Diagnosis[];
  prescriptions?: Prescription[];
  labevents?: LabEvent[];
  discharge?: DischargeNote[];
  icustays?: ICUStay[];
}

export interface Admission {
  hadm_id: number;
  admit_time: string;
  discharge_time: string;
  admission_type: string;
  chief_complaint?: string;
}

export interface Diagnosis {
  hadm_id: number;
  icd_code: string;
  icd_version: number;
  seq_num: number;
}

export interface Prescription {
  hadm_id: number;
  pharmacy_id: number;
  poe_id: number;
  poe_seq: number;
  order_provider_id: number;
  starttime: string;
  stoptime?: string;
  drug: string;
  drug_type: string;
  drug_name_poe: string;
  drug_name_generic: string;
  formulary_drug_cd: string;
  route: string;
}

export interface LabEvent {
  hadm_id: number;
  itemid: number;
  charttime: string;
  value: string;
  valuenum?: number;
  valueuom?: string;
  flag?: string;
}

export interface DischargeNote {
  hadm_id: number;
  note_type: string;
  note_seq: number;
  text: string;
}

export interface ICUStay {
  hadm_id: number;
  icustay_id: number;
  first_careunit: string;
  last_careunit: string;
  intime: string;
  outtime: string;
  los: number;
} 