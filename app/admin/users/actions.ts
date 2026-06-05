"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/app/utils/supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || 'monohall_secret_key_123';

function checkAuth(token: string | undefined): any {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (e) {
        return null;
    }
}

export async function getUsers() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const authUser = checkAuth(token);
    
    if (!authUser || authUser.role !== 'admin') return { success: false, error: "Unauthorized" };

    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, role, created_at');

        if (error) throw error;

        return { success: true, users: data };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function createUser(username: string, password?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const authUser = checkAuth(token);
    
    if (!authUser || authUser.role !== 'admin') return { success: false, error: "Unauthorized" };

    if (!username) return { success: false, error: "Username required" };

    let finalPassword = password;
    if (!finalPassword) {
        finalPassword = crypto.randomBytes(8).toString('hex');
    }

    const hash = bcrypt.hashSync(finalPassword, 10);

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password: hash, role: 'admin' }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // unique violation
                return { success: false, error: "Username already exists" };
            }
            throw error;
        }

        revalidatePath("/admin/users");
        return { 
            success: true, 
            message: "User created successfully",
            user: {
                id: data.id,
                username: data.username,
                generatedPassword: finalPassword
            }
        };
    } catch (error: any) {
        console.error("Error creating user:", error);
        return { success: false, error: error.message || "Failed to create user" };
    }
}

export async function deleteUser(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const authUser = checkAuth(token);
    
    if (!authUser || authUser.role !== 'admin') return { success: false, error: "Unauthorized" };

    if (authUser.id === id) {
        return { success: false, error: "Cannot delete your own account" };
    }

    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/users");
        return { success: true, message: "User deleted" };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, error: error.message || "Failed to delete user" };
    }
}

export async function updateProfile(newUsername?: string, currentPassword?: string, newPassword?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const authUser = checkAuth(token);
    
    if (!authUser) return { success: false, error: "Unauthorized" };

    if (!currentPassword) {
        return { success: false, error: "Current password is required to update profile" };
    }

    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (fetchError || !user) throw new Error("User not found");

        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return { success: false, error: "Incorrect current password" };
        }

        const updates: any = {
            username: newUsername || user.username
        };

        if (newPassword) {
            updates.password = bcrypt.hashSync(newPassword, 10);
        }

        const { error: updateError } = await supabase
            .from('users')
            .update(updates)
            .eq('id', authUser.id);

        if (updateError) {
             if (updateError.code === '23505') { 
                return { success: false, error: "Username already exists" };
            }
            throw updateError;
        }

        // Force re-login
        cookieStore.delete("admin_token");
        return { success: true, message: "Profile updated successfully" };
    } catch (error: any) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
}
