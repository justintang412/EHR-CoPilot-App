import { Request, Response } from 'express';
import { getPaginatedPatients } from '../services/patient.service';
import { getFullPatientDataService } from '../services/patient.service';

export async function getPatients(req: Request, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const { data, total } = await getPaginatedPatients(limit, offset);
    res.json({ data, total, page: Math.floor(offset / limit) + 1, pageSize: limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients', details: error instanceof Error ? error.message : error });
    return;
  }
}

export async function getFullPatientData(req: Request, res: Response) {
  try {
    const subject_id = Number(req.params.subject_id);
    if (isNaN(subject_id)) {
      res.status(400).json({ error: 'Invalid subject_id' });
      return;
    }
    const data = await getFullPatientDataService(subject_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch full patient data', details: error instanceof Error ? error.message : error });
    return;
  }
} 