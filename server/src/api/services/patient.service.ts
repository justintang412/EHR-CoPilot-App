// server/src/api/services/patient.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculates the age of a person based on their date of birth.
 * @param dateOfBirth The date of birth as a Date object.
 * @returns The age in years.
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  
  // If the current month is before the birth month,
  // or if it's the same month but today's date is before the birth date,
  // then the person hasn't had their birthday yet this year.
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age < 0 ? 0 : age;
}

export async function getPaginatedPatients(limit: number, offset: number) {
  const [data, total] = await Promise.all([
    prisma.patient.findMany({
      skip: offset,
      take: limit,
      orderBy: { subject_id: 'asc' },
    }),
    prisma.patient.count(),
  ]);
  return { data, total };
}

export async function getFullPatientDataService(subject_id: number) {
  const prisma = new PrismaClient();
  // Use $queryRaw for tables that are @@ignore (no Prisma model)
  // For Patient, use the Prisma model
  const patient = await prisma.patient.findUnique({ where: { subject_id } });

  // Helper to run raw queries for tables with @@ignore
  const raw = async (table: string) =>
    prisma.$queryRawUnsafe(`SELECT * FROM ${table} WHERE subject_id = $1`, subject_id);

  // List of tables to query (add more as needed)
  const [
    admissions,
    diagnoses_icd,
    drgcodes,
    emar,
    emar_detail,
    hcpcsevents,
    labevents,
    microbiologyevents,
    omr,
    pharmacy,
    poe,
    poe_detail,
    prescriptions,
    procedures_icd,
    services,
    transfers,
    chartevents,
    datetimeevents,
    icustays,
    ingredientevents,
    inputevents,
    outputevents,
    procedureevents,
    discharge,
    discharge_detail,
    radiology,
    radiology_detail,
    edstays,
    diagnosis,
    triage,
    vitalsign
  ] = await Promise.all([
    raw('mimiciv_hosp.admissions'),
    raw('mimiciv_hosp.diagnoses_icd'),
    raw('mimiciv_hosp.drgcodes'),
    raw('mimiciv_hosp.emar'),
    raw('mimiciv_hosp.emar_detail'),
    raw('mimiciv_hosp.hcpcsevents'),
    raw('mimiciv_hosp.labevents'),
    raw('mimiciv_hosp.microbiologyevents'),
    raw('mimiciv_hosp.omr'),
    raw('mimiciv_hosp.pharmacy'),
    raw('mimiciv_hosp.poe'),
    raw('mimiciv_hosp.poe_detail'),
    raw('mimiciv_hosp.prescriptions'),
    raw('mimiciv_hosp.procedures_icd'),
    raw('mimiciv_hosp.services'),
    raw('mimiciv_hosp.transfers'),
    raw('mimiciv_icu.chartevents'),
    raw('mimiciv_icu.datetimeevents'),
    raw('mimiciv_icu.icustays'),
    raw('mimiciv_icu.ingredientevents'),
    raw('mimiciv_icu.inputevents'),
    raw('mimiciv_icu.outputevents'),
    raw('mimiciv_icu.procedureevents'),
    raw('mimiciv_note.discharge'),
    raw('mimiciv_note.discharge_detail'),
    raw('mimiciv_note.radiology'),
    raw('mimiciv_note.radiology_detail'),
    raw('mimiciv_ed.edstays'),
    raw('mimiciv_ed.diagnosis'),
    raw('mimiciv_ed.triage'),
    raw('mimiciv_ed.vitalsign'),
  ]);

  return {
    patient,
    admissions,
    diagnoses_icd,
    drgcodes,
    emar,
    emar_detail,
    hcpcsevents,
    labevents,
    microbiologyevents,
    omr,
    pharmacy,
    poe,
    poe_detail,
    prescriptions,
    procedures_icd,
    services,
    transfers,
    chartevents,
    datetimeevents,
    icustays,
    ingredientevents,
    inputevents,
    outputevents,
    procedureevents,
    discharge,
    discharge_detail,
    radiology,
    radiology_detail,
    edstays,
    diagnosis,
    triage,
    vitalsign
  };
}