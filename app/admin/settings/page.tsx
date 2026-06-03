
import { getSettings } from "./actions";
import ManageSettings from "./ManageSettings";

export default async function Page() {
    const settings = await getSettings();

    return <ManageSettings settings={settings} />;
}
