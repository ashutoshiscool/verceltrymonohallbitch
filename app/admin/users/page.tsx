
import { getUsers } from "./actions";
import ManageUsers from "./ManageUsers";

export default async function Page() {
    const res = await getUsers();
    const users = res.success ? res.users : [];

    return <ManageUsers users={users} />;
}
