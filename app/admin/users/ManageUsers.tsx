"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, UserPlus, Copy, Check, Users as UsersIcon, ShieldAlert, Lock } from "lucide-react";
import { createUser, deleteUser, updateProfile } from "./actions";

type User = {
    id: number;
    username: string;
    role: string;
    created_at: string;
};

interface ManageUsersProps {
    users: User[];
}

export default function ManageUsers({ users: initialUsers }: ManageUsersProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [newUsername, setNewUsername] = useState("");
    const [customPassword, setCustomPassword] = useState("");
    const [generatedPass, setGeneratedPass] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    
    // Profile Update State
    const [profileUsername, setProfileUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    async function handleAddUser(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setGeneratedPass(null);
        setIsCreating(true);

        const res = await createUser(newUsername, customPassword);

        if (res.success) {
            setNewUsername("");
            setCustomPassword("");
            setGeneratedPass(res.user.generatedPassword);
            router.refresh();
        } else {
            setError(res.message || res.error || "Failed to create user");
        }
        setIsCreating(false);
    }

    async function handleDeleteUser(id: number) {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        const res = await deleteUser(id);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.message || "Failed to delete user");
        }
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");
        setIsUpdating(true);

        const res = await updateProfile(profileUsername, currentPassword, newPassword);

        if (res.success) {
            setProfileSuccess("Profile updated! Redirecting to login...");
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => {
                router.push("/admin");
            }, 2000);
        } else {
            setProfileError(res.message || res.error || "Failed to update profile");
        }
        setIsUpdating(false);
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col font-inter">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span className="font-syne font-bold text-xl tracking-tight">
                            MANAGE USERS
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">

                {/* Update Profile Section */}
                <div className="bg-white border border-neutral-200 p-8 mb-12 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-800 to-black"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
                        <div>
                            <h2 className="font-syne font-bold text-2xl uppercase mb-2">My Account</h2>
                            <p className="text-sm text-neutral-500">Update your username or password. You will be logged out upon success.</p>
                        </div>
                        <Lock className="w-12 h-12 text-neutral-100" />
                    </div>

                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end">
                        <div className="w-full">
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                New Username
                            </label>
                            <input
                                type="text"
                                value={profileUsername}
                                onChange={(e) => setProfileUsername(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Required to save changes"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full md:w-auto px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isUpdating ? "Saving..." : "Update"}
                        </button>
                    </form>

                    {profileError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            {profileError}
                        </div>
                    )}
                    {profileSuccess && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-100 text-green-700 text-sm font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {profileSuccess}
                        </div>
                    )}
                </div>

                {/* Create User Section */}
                <div className="bg-white border border-neutral-200 p-8 mb-12 relative overflow-hidden group">
                    {/* Orange Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-orange-400"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
                        <div>
                            <h2 className="font-syne font-bold text-2xl uppercase mb-2">Create New Admin</h2>
                            <p className="text-sm text-neutral-500">Add a new administrator with auto-generated secure credentials.</p>
                        </div>
                        <UsersIcon className="w-12 h-12 text-neutral-100" />
                    </div>

                    <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <div className="w-full">
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="e.g. johndoe"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-xs font-bold font-inter tracking-widest uppercase text-neutral-500 mb-2">
                                Password <span className="text-neutral-300 font-normal normal-case tracking-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={customPassword}
                                onChange={(e) => setCustomPassword(e.target.value)}
                                placeholder="Auto-generate if empty"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm font-medium focus:outline-none focus:border-orange-600 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="w-full md:w-auto px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-colors shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isCreating ? "Generating..." : "Create User"}
                            {!isCreating && <UserPlus className="w-4 h-4" />}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Success / Generated Password Display */}
                    {generatedPass && (
                        <div className="mt-6 p-6 bg-green-50 border border-green-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-green-800 mb-4 flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                User Created Successfully
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 border border-green-100 rounded-lg shadow-sm">
                                <div className="flex-1 w-full">
                                    <p className="text-xs text-neutral-400 font-bold uppercase mb-1">Generated Password</p>
                                    <code className="text-lg font-mono font-bold text-black block">{generatedPass}</code>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(generatedPass)}
                                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied" : "Copy Password"}
                                </button>
                            </div>
                            <p className="mt-4 text-xs text-red-500 font-medium">
                                * IMPORTANT: Copy this password immediately. It will not be shown again.
                            </p>
                        </div>
                    )}
                </div>

                {/* Users List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-4">
                        Existing Users
                    </h3>

                    {users.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400 text-sm border border-dashed border-neutral-300">
                            No users found.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {users.map((user) => (
                                <div key={user.id} className="bg-white border border-neutral-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-orange-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 font-bold uppercase">
                                            {user.username.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-syne font-bold text-lg text-black">{user.username}</p>
                                            <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium uppercase tracking-wider">
                                                <span>{user.role}</span>
                                                <span>•</span>
                                                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="p-2 text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
