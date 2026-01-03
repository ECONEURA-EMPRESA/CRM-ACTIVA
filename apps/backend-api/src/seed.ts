import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- SEED DATA ---
// Using strict types is hard here without importing frontend types, so we use 'any' for seed script only.
const INITIAL_PATIENTS = [
  {
    name: 'Maria García',
    age: 78,
    diagnosis: 'Alzheimer Fase Leve',
    pathologyType: 'dementia',
    photo:
      'https://images.unsplash.com/photo-1551185887-3ca9214b98c3?auto=format&fit=crop&w=200&h=200',
    contact: '+34 600 123 456',
    joinedDate: '2024-01-15',
    sessions: [
      {
        id: 101,
        date: '15/05/2024',
        type: 'individual',
        price: 50,
        paid: true,
        notes: 'Respuesta positiva a música biográfica.',
        activityDetails: {
          hello: 'Canción Bienvenida',
          main: 'Improvisación rítmica',
          goodbye: 'Canción Despedida',
        },
        qualitative: {
          musical: 'Participativa',
          emotional: 'Alegre',
          cognitive: 'Atenta',
          physical: 'Activa',
        },
      },
      {
        id: 102,
        date: '22/05/2024',
        type: 'individual',
        price: 50,
        paid: false,
        notes: 'Algo agitada al inicio.',
        scores: [2, 2, 1, 3, 2],
      },
    ],
    clinicalFormulation: {
      synthesis:
        'Demencia tipo Alzheimer en estadio GDS 3. Preservación de memoria musical procedimental.',
      hypothesis: 'La estimulación rítmica puede mejorar la marcha y reducir riesgo de caídas.',
      preserved: {
        selected: ['Memoria Musical', 'Lenguaje Expresivo'],
        text: 'Mantiene capacidad de cantar letras completas.',
      },
      difficulties: {
        selected: ['Memoria a Corto Plazo', 'Orientación'],
        text: 'Desorientación temporal frecuente.',
      },
      regulators: { selected: [], text: '' },
    },
    currentEval: [2, 2, 2, 2, 1],
    initialEval: [1, 1, 1, 1, 0],
    cognitiveScores: { moca: 22, mmse: 24, gds: 3, date: '10/01/2024' },
    initialGoals: 'Mantener capacidades lingüísticas y fomentar socialización.',
    musicStyles: 'Boleros, Copla, Música Clásica (Mozart).',
    dislikedSounds: 'Sonidos metálicos fuertes, Jazz libre.',
    reference: 'REF-001',
  },
  {
    name: 'Antonio López',
    age: 82,
    diagnosis: 'Parkinson Avanzado',
    pathologyType: 'neuro',
    contact: '+34 600 999 888',
    joinedDate: '2024-03-01',
    sessions: [
      {
        id: 201,
        date: '10/05/2024',
        type: 'group',
        price: 25,
        paid: true,
        notes: 'Taller de voz.',
        location: 'Sala 2',
        participantNames: ['Maria García', 'Antonio López'],
      },
    ],
    clinicalFormulation: {
      synthesis: '',
      hypothesis: '',
      preserved: { selected: [], text: '' },
      difficulties: { selected: [], text: '' },
      regulators: { selected: [], text: '' },
    },
    initialGoals: 'Mejorar volumen de voz y coordinación respiratoria.',
    musicStyles: 'Marchas militares, Zarzuela.',
    reference: 'REF-002',
  },
  {
    name: 'Isabel Ruiz',
    age: 65,
    diagnosis: 'Depresión Mayor',
    pathologyType: 'mood',
    photo:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200',
    contact: '+34 600 555 111',
    joinedDate: '2024-04-10',
    sessions: [],
    clinicalFormulation: {
      synthesis: '',
      hypothesis: '',
      preserved: { selected: [], text: '' },
      difficulties: { selected: [], text: '' },
      regulators: { selected: [], text: '' },
    },
    initialGoals: 'Expresión emocional y aumento de motivación.',
    musicStyles: 'Pop Español 80s, Cantautores.',
    reference: 'REF-003',
  },
];

// --- EXECUTE SEED ---
async function seed() {
  console.log('🌱 Starting Seed Process...');

  try {
    initializeApp({
      credential: applicationDefault(),
    });
    const db = getFirestore();
    const collection = db.collection('patients');

    // Check if empty
    const snapshot = await collection.limit(1).get();
    if (!snapshot.empty) {
      console.log('⚠️ Database already has data. Skipping seed to prevent duplicates.');
      process.exit(0);
    }

    const batch = db.batch();

    for (const patient of INITIAL_PATIENTS) {
      const docRef = collection.doc(); // Auto ID
      batch.set(docRef, patient);
      console.log(`Prepared: ${patient.name}`);
    }

    await batch.commit();
    console.log('✅ Seed Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Failed:', error);
    process.exit(1);
  }
}

seed();
