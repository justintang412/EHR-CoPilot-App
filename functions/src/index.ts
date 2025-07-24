import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// CORS middleware
const cors = (req: any, res: any, next: any) => {
  // Allow all origins since we're not using credentials
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
};

// Authentication middleware
const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No valid authorization header' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /patients?limit=10&offset=0
export const getPaginatedPatients = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Add authentication
    authenticateUser(req, res, async () => {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      try {
        // Firestore offset is inefficient for large collections, but fine for small ones
        const snapshot = await db.collection('patients')
          .orderBy('subject_id')
          .offset(offset)
          .limit(limit)
          .get();

        const data = snapshot.docs.map(doc => ({ subject_id: doc.id, ...doc.data() }));
        const totalSnapshot = await db.collection('patients').get();
        const total = totalSnapshot.size;

        res.json({ data, total });
      } catch (error: any) {
        console.error('Error in getPaginatedPatients:', error);
        res.status(500).json({ error: error.message });
      }
    });
  });
});

// GET /patient?subject_id=123
export const getFullPatientData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // Add authentication
    authenticateUser(req, res, async () => {
      const subject_id = req.query.subject_id as string;
      if (!subject_id) {
        res.status(400).json({ error: 'Missing subject_id' });
        return;
      }

      try {
        const patientRef = db.collection('patients').doc(subject_id);
        const patientSnap = await patientRef.get();
        if (!patientSnap.exists) {
          res.status(404).json({ error: 'Patient not found' });
          return;
        }
        const patient = patientSnap.data();

        // Helper to get all docs in a subcollection
        const getAllDocs = async (subcol: string) => {
          const snap = await patientRef.collection(subcol).get();
          return snap.docs.map(doc => doc.data());
        };

        // Helper to get all events from chunked subcollections
        const getChunkedEvents = async (subcol: string) => {
          const snap = await patientRef.collection(subcol).get();
          let events: any[] = [];
          snap.docs.forEach(doc => {
            const chunk = doc.data();
            events = events.concat(chunk.events || []);
          });
          return events;
        };

        // One-doc-per-row subcollections
        const [
          admissions, diagnoses_icd, drgcodes, emar, hcpcsevents, omr, pharmacy, poe,
          prescriptions, procedures_icd, services, transfers, icustays, edstays,
          diagnosis, triage, discharge, radiology
        ] = await Promise.all([
          getAllDocs('admissions'),
          getAllDocs('diagnoses_icd'),
          getAllDocs('drgcodes'),
          getAllDocs('emar'),
          getAllDocs('hcpcsevents'),
          getAllDocs('omr'),
          getAllDocs('pharmacy'),
          getAllDocs('poe'),
          getAllDocs('prescriptions'),
          getAllDocs('procedures_icd'),
          getAllDocs('services'),
          getAllDocs('transfers'),
          getAllDocs('icustays'),
          getAllDocs('edstays'),
          getAllDocs('diagnosis'),
          getAllDocs('triage'),
          getAllDocs('discharge'),
          getAllDocs('radiology'),
        ]);

        // Chunked subcollections
        const [labevents, chartevents, vitalsign] = await Promise.all([
          getChunkedEvents('labevents'),
          getChunkedEvents('chartevents'),
          getChunkedEvents('vitalsign'),
        ]);

        res.json({
          patient,
          admissions,
          diagnoses_icd,
          drgcodes,
          emar,
          hcpcsevents,
          omr,
          pharmacy,
          poe,
          prescriptions,
          procedures_icd,
          services,
          transfers,
          icustays,
          edstays,
          diagnosis,
          triage,
          discharge,
          radiology,
          labevents,
          chartevents,
          vitalsign,
        });
      } catch (error: any) {
        console.error('Error in getFullPatientData:', error);
        res.status(500).json({ error: error.message });
      }
    });
  });
}); 