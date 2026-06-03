import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Briefcase, LogOut, Sliders } from "lucide-react";
import { logoutAction } from "../actions";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token) {
        redirect("/admin");
    }

    // TODO: Verify token validity by calling backend /verify endpoint if needed
    // For now, presence of cookie is enough for this step.

    const menuItems = [
        {
            title: "Manage Events",
            description: "Create, edit, and schedule upcoming shows.",
            icon: Calendar,
            href: "/admin/events",
        },
        {
            title: "Manage Users",
            description: "View registered users and permissions.",
            icon: Users,
            href: "/admin/users",
        },
        {
            title: "Manage Brands",
            description: "Handle partners and sponsors.",
            icon: Briefcase,
            href: "/admin/brands",
        },
        {
            title: "Site Configuration",
            description: "Layouts, sizes, and global settings.",
            icon: Sliders, // Assuming Sliders is imported or needs to be
            href: "/admin/settings",
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Top Bar */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <span className="font-syne font-bold text-xl tracking-tight">
                        ADMIN DASHBOARD
                    </span>
                </div>

                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors"
                    >
                        Logout
                        <LogOut className="w-4 h-4" />
                    </button>
                </form>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
                <div className="mb-12">
                    <p className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-2">
                        Overview
                    </p>
                    <h1 className="font-syne font-black text-4xl md:text-6xl uppercase leading-none">
                        Welcome Back,<br />Admin.
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group bg-white border border-neutral-200 p-8 flex flex-col gap-6 hover:border-orange-600 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="font-syne font-bold text-2xl uppercase group-hover:text-orange-600 transition-colors">
                                    {item.title}
                                </h2>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
