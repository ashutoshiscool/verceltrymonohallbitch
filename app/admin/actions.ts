"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            cache: 'no-store'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set("admin_token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return { success: true };
        } else {
            return { success: false, message: data.message || "Invalid credentials" };
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
