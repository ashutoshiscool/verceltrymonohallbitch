"use server";

export async function getBrand(id: string) {
    try {
        const res = await fetch(`http://localhost:3001/brands/${id}`, { cache: 'no-store' });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching brand:", error);
        return { success: false, error: "Failed to fetch brand" };
    }
}
