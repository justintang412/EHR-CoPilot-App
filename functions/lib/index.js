"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullPatientData = exports.getPaginatedPatients = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// CORS middleware
const cors = (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    next();
};
// Authentication middleware
const authenticateUser = async (req, res, next) => {
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
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
// GET /patients?limit=10&offset=0
exports.getPaginatedPatients = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        // Add authentication
        authenticateUser(req, res, async () => {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
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
            }
            catch (error) {
                console.error('Error in getPaginatedPatients:', error);
                res.status(500).json({ error: error.message });
            }
        });
    });
});
// GET /patient?subject_id=123
exports.getFullPatientData = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        // Add authentication
        authenticateUser(req, res, async () => {
            const subject_id = req.query.subject_id;
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
                const getAllDocs = async (subcol) => {
                    const snap = await patientRef.collection(subcol).get();
                    return snap.docs.map(doc => doc.data());
                };
                // Helper to get all events from chunked subcollections
                const getChunkedEvents = async (subcol) => {
                    const snap = await patientRef.collection(subcol).get();
                    let events = [];
                    snap.docs.forEach(doc => {
                        const chunk = doc.data();
                        events = events.concat(chunk.events || []);
                    });
                    return events;
                };
                // One-doc-per-row subcollections
                const [admissions, diagnoses_icd, drgcodes, emar, hcpcsevents, omr, pharmacy, poe, prescriptions, procedures_icd, services, transfers, icustays, edstays, diagnosis, triage, discharge, radiology] = await Promise.all([
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
            }
            catch (error) {
                console.error('Error in getFullPatientData:', error);
                res.status(500).json({ error: error.message });
            }
        });
    });
});
//# sourceMappingURL=index.js.map