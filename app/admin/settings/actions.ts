"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    try {
        const res = await fetch("http://localhost:3001/settings", { cache: 'no-store' });
        const data = await res.json();
        return data.settings || {};
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {};
    }
}

export async function updateSettings(settings: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch("http://localhost:3001/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ settings }),
        });
        const data = await res.json();
        revalidatePath("/");
        revalidatePath("/admin/brands"); // if shown there
        return data;
    } catch (error) {
        console.error("Error updating settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}
