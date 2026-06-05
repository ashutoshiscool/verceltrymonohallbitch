"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/app/utils/supabase";

function checkAuth(token: string | undefined) {
    if (!token) return false;
    return true; 
}

export async function getSettings() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');
        
        if (error) throw error;

        const settings: any = {};
        data.forEach((row: any) => {
            settings[row.key] = row.value;
        });

        return settings;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {};
    }
}

export async function updateSettings(settings: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    try {
        // Upsert settings one by one or in batch
        const upsertData = Object.entries(settings).map(([key, value]) => ({
            key,
            value: String(value)
        }));

        const { error } = await supabase
            .from('settings')
            .upsert(upsertData);

        if (error) throw error;

        revalidatePath("/");
        revalidatePath("/admin/brands");
        revalidatePath("/admin/settings");
        return { success: true, message: "Settings updated" };
    } catch (error: any) {
        console.error("Error updating settings:", error);
        return { success: false, error: error.message || "Failed to update settings" };
    }
}
