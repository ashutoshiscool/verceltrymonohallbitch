"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase, uploadImageToSupabase } from "@/app/utils/supabase";

function checkAuth(token: string | undefined) {
    if (!token) return false;
    return true; 
}

export async function getBrands() {
    try {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, brands: data };
    } catch (error) {
        console.error("Error fetching brands:", error);
        return { success: false, error: "Failed to fetch brands" };
    }
}

export async function createBrand(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logoFile = formData.get("logo") as File;

    if (!name || !logoFile || logoFile.size === 0) {
        return { success: false, error: "Name and Logo are required" };
    }

    const logo_url = await uploadImageToSupabase(logoFile);
    if (!logo_url) {
        return { success: false, error: "Failed to upload logo" };
    }

    try {
        const { data, error } = await supabase
            .from('brands')
            .insert([{ name, description, logo_url }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/brands");
        return { success: true, message: "Brand created successfully", brand: data };
    } catch (error: any) {
        console.error("Error creating brand:", error);
        return { success: false, error: error.message || "Failed to create brand" };
    }
}

export async function deleteBrand(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    try {
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/brands");
        return { success: true, message: "Brand deleted" };
    } catch (error: any) {
        console.error("Error deleting brand:", error);
        return { success: false, error: error.message || "Failed to delete brand" };
    }
}
