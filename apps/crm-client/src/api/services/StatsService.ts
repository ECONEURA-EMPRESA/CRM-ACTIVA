import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase";

const API_URL = import.meta.env.VITE_API_URL || "https://metodo-activa-saas-1767353295.web.app/api";

export const StatsService = {
    getDashboardStats: async () => {
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const token = await user.getIdToken();
        const response = await fetch(`${API_URL}/stats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch stats");
        return response.json();
    }
};
