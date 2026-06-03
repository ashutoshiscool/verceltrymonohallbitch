"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    try {
        const res = await fetch("http://localhost:3001/events", { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return { success: false, error: "Failed to fetch events" };
    }
}

export async function getFeaturedEvents() {
    try {
        const res = await fetch("http://localhost:3001/events/featured", { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching featured events:", error);
        return { success: false, error: "Failed to fetch featured events" };
    }
}

export async function getEventsByBrand(brandId: string) {
    try {
        const res = await fetch(`http://localhost:3001/events/brand/${brandId}`, { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching events by brand:", error);
        return { success: false, error: "Failed to fetch events by brand" };
    }
}

export async function getEvent(id: string) {
    try {
        const res = await fetch(`http://localhost:3001/events/${id}`, { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching event:", error);
        return { success: false, error: "Failed to fetch event" };
    }
}

export async function createEvent(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    const artist = formData.get("artist") as string;
    const subtitle = formData.get("subtitle") as string;
    const date = formData.get("date") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const ticket_url = formData.get("ticket_url") as string;
    const brand_id = formData.get("brand_id") as string;
    const is_featured = formData.get("is_featured") === "true";
    const imageFile = formData.get("image") as File;
    let image_base64 = "";

    if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        image_base64 = `data:${imageFile.type};base64,${base64}`;
    }

    try {
        const res = await fetch("http://localhost:3001/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                artist, subtitle, date, price, status, ticket_url, image_base64,
                brand_id: brand_id ? parseInt(brand_id) : null,
                is_featured
            }),
        });
        const data = await res.json();
        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        return data;
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Failed to create event" };
    }
}

export async function updateEvent(id: number, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    const artist = formData.get("artist") as string;
    const subtitle = formData.get("subtitle") as string;
    const date = formData.get("date") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const ticket_url = formData.get("ticket_url") as string;
    const brand_id = formData.get("brand_id") as string;
    const is_featured = formData.get("is_featured") === "true";
    const imageFile = formData.get("image") as File;
    let image_base64 = "";

    if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        image_base64 = `data:${imageFile.type};base64,${base64}`;
    }

    try {
        const res = await fetch(`http://localhost:3001/events/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                artist, subtitle, date, price, status, ticket_url,
                ...(image_base64 && { image_base64 }),
                brand_id: brand_id ? parseInt(brand_id) : null,
                is_featured
            }),
        });
        const data = await res.json();
        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        revalidatePath(`/events/${id}`);
        return data;
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Failed to update event" };
    }
}

export async function deleteEvent(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch(`http://localhost:3001/events/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        return data;
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}

// Gallery actions
export async function getEventGallery(eventId: string) {
    try {
        const res = await fetch(`http://localhost:3001/events/${eventId}/gallery`, { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching event gallery:", error);
        return { success: false, error: "Failed to fetch event gallery" };
    }
}

export async function addToGallery(eventId: number, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    const caption = formData.get("caption") as string;
    const imageFile = formData.get("image") as File;
    let image_base64 = "";

    if (imageFile && imageFile.size > 0) {
        const buffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        image_base64 = `data:${imageFile.type};base64,${base64}`;
    }

    if (!image_base64) return { success: false, error: "Image is required" };

    try {
        const res = await fetch(`http://localhost:3001/events/${eventId}/gallery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ image_base64, caption }),
        });
        const data = await res.json();
        revalidatePath(`/events/${eventId}`);
        revalidatePath(`/admin/events/${eventId}`);
        return data;
    } catch (error) {
        console.error("Error adding to gallery:", error);
        return { success: false, error: "Failed to add to gallery" };
    }
}

export async function deleteFromGallery(imageId: number, eventId: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) return { success: false, error: "Unauthorized" };

    try {
        const res = await fetch(`http://localhost:3001/events/gallery/${imageId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        revalidatePath(`/events/${eventId}`);
        revalidatePath(`/admin/events/${eventId}`);
        return data;
    } catch (error) {
        console.error("Error deleting from gallery:", error);
        return { success: false, error: "Failed to delete from gallery" };
    }
}
