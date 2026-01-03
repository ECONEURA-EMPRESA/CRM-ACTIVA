import { Patient as PatientDTO } from '@monorepo/shared';

// Domain Entity
// Pure TypeScript class, no database annotations.
export class Patient {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly status: 'active' | 'archived' | 'waitlist',
    public readonly email?: string,
    public readonly phone?: string,
    public readonly createdAt?: Date,
  ) {}

  // Factory method to enforce invariants if needed
  static create(data: Omit<PatientDTO, 'id' | 'createdAt'>, userId: string): Patient {
    if (!userId) throw new Error('Patient must be owned by a User');

    return new Patient(
      '', // ID assigned by repo on save
      userId,
      data.firstName,
      data.lastName,
      data.status || 'active',
      data.email || undefined,
      data.phone || undefined,
      new Date(),
    );
  }
}
