"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getBrands() {
    try {
        const res = await fetch("http://localhost:3001/brands", { cache: 'no-store' });
        const data = await res.json();
        return data; // { success: true, brands: [...] }
    } catch (error) {
        console.error("Error fetching brands:", error);
        return { success: false, error: "Failed to fetch brands" };
    }
}

export async function createBrand(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logoFile = formData.get("logo") as File;
    let logo_base64 = "";

    if (logoFile && logoFile.size > 0) {
        const buffer = await logoFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        logo_base64 = `data:${logoFile.type};base64,${base64}`;
    }

    try {
        const res = await fetch("http://localhost:3001/brands", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, logo_base64 }),
        });
        const data = await res.json();
        revalidatePath("/admin/brands");
        return data;
    } catch (error) {
        console.error("Error creating brand:", error);
        return { success: false, error: "Failed to create brand" };
    }
}

export async function deleteBrand(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch(`http://localhost:3001/brands/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        revalidatePath("/admin/brands");
        return data;
    } catch (error) {
        console.error("Error deleting brand:", error);
        return { success: false, error: "Failed to delete brand" };
    }
}
