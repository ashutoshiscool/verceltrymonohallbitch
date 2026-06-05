
import { getUsers } from "./actions";
import ManageUsers from "./ManageUsers";

export default async function Page() {
    const res = await getUsers();
    const users = (res.success ? (res.users || []) : []) as any;

    return <ManageUsers users={users} />;
}
