import { Patient } from '../domain/Patient';
import { IPatientRepository } from '../domain/IPatientRepository';
import { IDashboardStatsRepository } from '../domain/IDashboardStatsRepository';
import { PatientSchema } from '@monorepo/shared';

export class CreatePatientUseCase {
    constructor(
        private readonly patientRepo: IPatientRepository,
        private readonly statsRepo: IDashboardStatsRepository
    ) { }

    async execute(rawInput: unknown, userId: string): Promise<Patient> {
        // 1. Validate Input (Contract Layer)
        const validData = PatientSchema.parse(rawInput);

        // 2. Create Domain Entity (Invariant Layer)
        const patientHandler = Patient.create(validData, userId);

        // 3. Persist (Infrastructure Layer)
        const savedPatient = await this.patientRepo.save(patientHandler);

        // 4. Side Effect: Update Read Model (CQRS)
        await this.statsRepo.incrementActivePatients(userId);

        return savedPatient;
    }
}
