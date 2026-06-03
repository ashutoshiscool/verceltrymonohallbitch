
import { getBrands } from "./actions";
import ManageBrands from "./ManageBrands";

export default async function Page() {
    const res = await getBrands();
    const brands = res.success ? res.brands : [];

    return <ManageBrands brands={brands} />;
}
