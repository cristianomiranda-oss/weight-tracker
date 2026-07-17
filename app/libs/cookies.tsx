import { cookies } from "next/headers";

export async function createUserCookie(userId: number) {
    try {
        const cookieStore = await cookies();
        
        // Converts the number value to a string
        cookieStore.set("user_id", `${userId}`);

        return true;
    } catch (error) {
        return false;
    }
}