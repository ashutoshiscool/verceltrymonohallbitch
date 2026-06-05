"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase, uploadImageToSupabase } from "@/app/utils/supabase";

function checkAuth(token: string | undefined) {
    if (!token) return false;
    return true; // We could verify JWT here, but assuming middleware or client side handles basic checks, or we just trust the presence of token for now as it was in original code.
}

export async function getEvents() {
    try {
        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                brands (name)
            `)
            .order('date', { ascending: true });
        
        if (error) throw error;

        // Map the data to match the old format (brand_name instead of brands.name)
        const events = data.map(e => ({
            ...e,
            brand_name: e.brands?.name || null
        }));

        return { success: true, events };
    } catch (error) {
        console.error("Error fetching events:", error);
        return { success: false, error: "Failed to fetch events" };
    }
}

export async function getFeaturedEvents() {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*, brands(name)')
            .eq('is_featured', true)
            .order('date', { ascending: true })
            .limit(5);

        if (error) throw error;

        const events = data.map(e => ({
            ...e,
            brand_name: e.brands?.name || null
        }));

        return { success: true, events };
    } catch (error) {
        console.error("Error fetching featured events:", error);
        return { success: false, error: "Failed to fetch featured events: " + JSON.stringify(error) };
    }
}

export async function getEventsByBrand(brandId: string) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*, brands(name)')
            .eq('brand_id', brandId)
            .order('date', { ascending: true });

        if (error) throw error;

        const events = data.map(e => ({
            ...e,
            brand_name: e.brands?.name || null
        }));

        return { success: true, events };
    } catch (error) {
        console.error("Error fetching events by brand:", error);
        return { success: false, error: "Failed to fetch events by brand" };
    }
}

export async function getEvent(id: string) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*, brands(name)')
            .eq('id', id)
            .single();

        if (error) throw error;

        const event = {
            ...data,
            brand_name: data.brands?.name || null
        };

        return { success: true, event };
    } catch (error) {
        console.error("Error fetching event:", error);
        return { success: false, error: "Failed to fetch event" };
    }
}

export async function createEvent(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    const artist = formData.get("artist") as string;
    const subtitle = formData.get("subtitle") as string;
    const date = formData.get("date") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const ticket_url = formData.get("ticket_url") as string;
    const brand_id = formData.get("brand_id") as string;
    const is_featured = formData.get("is_featured") === "true";
    const imageFile = formData.get("image") as File;

    let image_url = null;
    if (imageFile && imageFile.size > 0) {
        image_url = await uploadImageToSupabase(imageFile);
    }

    try {
        const { data, error } = await supabase
            .from('events')
            .insert([{
                artist, 
                subtitle, 
                date, 
                price: price || '', 
                status, 
                ticket_url, 
                image_url, 
                brand_id: brand_id ? parseInt(brand_id) : null,
                is_featured
            }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        return { success: true, message: "Event created successfully", event: data };
    } catch (error: any) {
        console.error("Error creating event:", error);
        return { success: false, error: error.message || "Failed to create event" };
    }
}

export async function updateEvent(id: number, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    const artist = formData.get("artist") as string;
    const subtitle = formData.get("subtitle") as string;
    const date = formData.get("date") as string;
    const price = formData.get("price") as string;
    const status = formData.get("status") as string;
    const ticket_url = formData.get("ticket_url") as string;
    const brand_id = formData.get("brand_id") as string;
    const is_featured = formData.get("is_featured") === "true";
    const imageFile = formData.get("image") as File;

    const updates: any = {
        artist, subtitle, date, price: price || '', status, ticket_url,
        brand_id: brand_id ? parseInt(brand_id) : null,
        is_featured
    };

    if (imageFile && imageFile.size > 0) {
        const image_url = await uploadImageToSupabase(imageFile);
        if (image_url) {
            updates.image_url = image_url;
        }
    }

    try {
        const { error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        revalidatePath(`/events/${id}`);
        return { success: true, message: "Event updated successfully" };
    } catch (error: any) {
        console.error("Error updating event:", error);
        return { success: false, error: error.message || "Failed to update event" };
    }
}

export async function deleteEvent(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath("/admin/events");
        revalidatePath("/");
        revalidatePath("/events");
        return { success: true, message: "Event deleted" };
    } catch (error: any) {
        console.error("Error deleting event:", error);
        return { success: false, error: error.message || "Failed to delete event" };
    }
}

// Gallery actions
export async function getEventGallery(eventId: string) {
    try {
        const { data, error } = await supabase
            .from('event_gallery')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, gallery: data };
    } catch (error) {
        console.error("Error fetching event gallery:", error);
        return { success: false, error: "Failed to fetch event gallery" };
    }
}

export async function addToGallery(eventId: number, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    const caption = formData.get("caption") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) return { success: false, error: "Image is required" };

    const image_url = await uploadImageToSupabase(imageFile);
    if (!image_url) return { success: false, error: "Failed to upload image" };

    try {
        const { data, error } = await supabase
            .from('event_gallery')
            .insert([{ event_id: eventId, image_url, caption: caption || '' }])
            .select()
            .single();

        if (error) throw error;

        revalidatePath(`/events/${eventId}`);
        revalidatePath(`/admin/events/${eventId}`);
        return { success: true, message: "Image added to gallery", image: data };
    } catch (error: any) {
        console.error("Error adding to gallery:", error);
        return { success: false, error: error.message || "Failed to add to gallery" };
    }
}

export async function deleteFromGallery(imageId: number, eventId: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!checkAuth(token)) return { success: false, error: "Unauthorized" };

    try {
        const { error } = await supabase
            .from('event_gallery')
            .delete()
            .eq('id', imageId);

        if (error) throw error;

        revalidatePath(`/events/${eventId}`);
        revalidatePath(`/admin/events/${eventId}`);
        return { success: true, message: "Image deleted from gallery" };
    } catch (error: any) {
        console.error("Error deleting from gallery:", error);
        return { success: false, error: error.message || "Failed to delete from gallery" };
    }
}
