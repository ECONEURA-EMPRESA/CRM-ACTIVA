import { z } from "zod";

// Shared Types
export interface User {
    id: string;
    email: string;
    role: "admin" | "user";
}

// Shared Zod Schemas
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    role: z.enum(["admin", "user"]),
});
