import { getProfile } from "@/app/actions/auth";
import { UserSession } from "@construction/shared";

/**
 * Utility to get the current user session on the server side.
 * This can be used in Server Components to fetch user data.
 */
export async function getServerSession(): Promise<UserSession | null> {
    try {
        const result = await getProfile();
        if (result.data) {
            return result.data;
        }
        return null;
    } catch (error) {
        console.error("Error getting server session:", error);
        return null;
    }
}
