import { Router } from 'express';
import { getPatients } from '../controllers/patient.controller';
import { getFullPatientData } from '../controllers/patient.controller';
import { firebaseAuth } from '../middlewares/firebaseAuth';

const router = Router();

router.get('/', firebaseAuth, getPatients);
router.get('/:subject_id/full', firebaseAuth, getFullPatientData);

export default router; 