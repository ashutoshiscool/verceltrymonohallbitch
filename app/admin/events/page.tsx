
import { getEvents } from "./actions";
import { getBrands } from "../brands/actions";
import ManageEvents from "./ManageEvents";

export default async function Page() {
    const [eventsRes, brandsRes] = await Promise.all([getEvents(), getBrands()]);

    const events = (eventsRes.success ? (eventsRes.events || []) : []) as any;
    const brands = (brandsRes.success ? (brandsRes.brands || []) : []) as any;

    return <ManageEvents events={events} brands={brands} />;
}
