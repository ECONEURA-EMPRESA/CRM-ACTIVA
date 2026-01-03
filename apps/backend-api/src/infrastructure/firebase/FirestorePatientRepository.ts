import { Firestore } from 'firebase-admin/firestore';
import { IPatientRepository } from '../../core/domain/IPatientRepository';
import { Patient } from '../../core/domain/Patient';

export class FirestorePatientRepository implements IPatientRepository {
    constructor(private readonly db: Firestore) { }

    async save(patient: Patient): Promise<Patient> {
        const data = {
            userId: patient.userId,
            firstName: patient.firstName,
            lastName: patient.lastName,
            status: patient.status,
            email: patient.email || null,
            phone: patient.phone || null,
            createdAt: patient.createdAt || new Date()
        };

        if (patient.id) {
            await this.db.collection('patients').doc(patient.id).set(data, { merge: true });
            return patient;
        } else {
            const docRef = await this.db.collection('patients').add(data);
            // Return new entity with ID
            return new Patient(
                docRef.id,
                patient.userId,
                patient.firstName,
                patient.lastName,
                patient.status,
                patient.email,
                patient.phone,
                patient.createdAt
            );
        }
    }

    async findById(id: string): Promise<Patient | null> {
        const doc = await this.db.collection('patients').doc(id).get();
        if (!doc.exists) return null;
        const data = doc.data() as any;
        return new Patient(
            doc.id,
            data.userId,
            data.firstName,
            data.lastName,
            data.status,
            data.email,
            data.phone,
            data.createdAt?.toDate()
        );
    }

    async findByUserId(userId: string): Promise<Patient[]> {
        const snapshot = await this.db.collection('patients').where('userId', '==', userId).get();
        return snapshot.docs.map(doc => {
            const data = doc.data() as any;
            return new Patient(
                doc.id,
                data.userId,
                data.firstName,
                data.lastName,
                data.status,
                data.email,
                data.phone,
                data.createdAt?.toDate()
            );
        });
    }
}
