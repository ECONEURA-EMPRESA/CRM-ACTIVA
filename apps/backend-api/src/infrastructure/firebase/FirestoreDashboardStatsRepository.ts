import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { IDashboardStatsRepository } from '../../core/domain/IDashboardStatsRepository';

export class FirestoreDashboardStatsRepository implements IDashboardStatsRepository {
  constructor(private readonly db: Firestore) {}

  private getRef(userId: string) {
    return this.db.collection('settings').doc(`stats_${userId}`);
  }

  async incrementActivePatients(userId: string): Promise<void> {
    const ref = this.getRef(userId);
    await ref.set(
      {
        activePatients: FieldValue.increment(1),
        userId: userId, // Ensure ownership
      },
      { merge: true },
    );
  }

  async decrementActivePatients(userId: string): Promise<void> {
    const ref = this.getRef(userId);
    await ref.set(
      {
        activePatients: FieldValue.increment(-1),
      },
      { merge: true },
    );
  }

  async getStats(userId: string): Promise<{ activePatients: number }> {
    const doc = await this.getRef(userId).get();
    if (!doc.exists) return { activePatients: 0 };
    return doc.data() as { activePatients: number };
  }
}
