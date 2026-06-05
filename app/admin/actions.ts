"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/app/utils/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || 'monohall_secret_key_123';

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !user) {
            return { success: false, message: "Invalid credentials" };
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
            
            const cookieStore = await cookies();
            cookieStore.set("admin_token", token, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return { success: true };
        } else {
            return { success: false, message: "Invalid credentials" };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Failed to connect to backend" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    redirect("/admin");
}
