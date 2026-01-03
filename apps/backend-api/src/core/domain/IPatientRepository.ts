import { Patient } from '../domain/Patient';

export interface IPatientRepository {
    save(patient: Patient): Promise<Patient>;
    findById(id: string): Promise<Patient | null>;
    findByUserId(userId: string): Promise<Patient[]>;
    // Logic for strict ownership check is implicit in the implementation or service layer
}
