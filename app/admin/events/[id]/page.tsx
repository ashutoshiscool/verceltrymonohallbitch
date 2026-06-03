
import { getEvent, getEventGallery } from "../actions";
import ManageGallery from "./ManageGallery";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    // We can run these in parallel
    const [eventRes, galleryRes] = await Promise.all([
        getEvent(id),
        getEventGallery(id)
    ]);

    const event = eventRes.success ? eventRes.event : null;
    const gallery = galleryRes.success ? galleryRes.gallery : [];

    return <ManageGallery id={id} event={event} gallery={gallery} />;
}
