export interface IDashboardStatsRepository {
    incrementActivePatients(userId: string): Promise<void>;
    decrementActivePatients(userId: string): Promise<void>;
    getStats(userId: string): Promise<{ activePatients: number }>;
}
