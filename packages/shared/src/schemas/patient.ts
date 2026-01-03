import { z } from 'zod';

export const PatientSchema = z.object({
    id: z.string().optional(),
    userId: z.string().min(1, "User ID is required"),
    firstName: z.string().min(2, "Name must be at least 2 characters"),
    lastName: z.string().min(2, "Last Name must be at least 2 characters"),
    email: z.string().email().optional().or(z.literal('')),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    phone: z.string().optional(),
    status: z.enum(['active', 'archived', 'waitlist']).default('active'),
    createdAt: z.string().optional(), // ISO String
});

export type Patient = z.infer<typeof PatientSchema>;
