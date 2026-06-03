"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch("http://localhost:3001/users", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        });
        const data = await res.json();
        return data; // { success: true, users: [...] }
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function createUser(username: string, password?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        revalidatePath("/admin/users");
        return data; // { success: true, user: { username, generatedPassword, ... } }
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Failed to create user" };
    }
}

export async function deleteUser(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch(`http://localhost:3001/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        revalidatePath("/admin/users");
        return data;
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function updateProfile(newUsername?: string, currentPassword?: string, newPassword?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch("http://localhost:3001/users/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newUsername, currentPassword, newPassword }),
        });
        const data = await res.json();
        
        if (data.success) {
            // Delete token to force re-login
            cookieStore.delete("admin_token");
        }
        
        return data;
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
