"use client";

import { useSettings } from "@/context/SettingsContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
    const { settings, loading } = useSettings();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (loading || status === "loading") return;

        const isMaintenancePage = pathname === "/maintenance";
        const isAdminRoute = pathname.startsWith("/admin");
        const isApiRoute = pathname.startsWith("/api");
        const isAuthRoute = pathname.startsWith("/auth"); // Ensure login is accessible if needed, though usually admin login

        // Allow admin access
        // We assume if session exists, they might be admin, or we check session.user.role if available.
        // For now, let's assume any logged in user is admin-ish or we just check if they are trying to access admin routes.
        // But if maintenance is on, we want to block public routes for everyone EXCEPT admins.

        // Simple Logic:
        // If Maintenance Mode ON:
        // - If User is Admin (session exists?): Allow everything.
        // - If User is NOT Admin:
        //   - Allow /maintenance
        //   - Allow /api (for login?)
        //   - Allow /admin (to let them log in)
        //   - Redirect everything else to /maintenance

        // Refined Logic:
        // If Maintenance Mode is ON:
        //   If user is NOT logged in (or not admin):
        //     If on /maintenance -> Stay
        //     If on /admin... -> Allow (so they can log in)
        //     If on /api... -> Allow
        //     Else -> Redirect to /maintenance
        //
        // If Maintenance Mode is OFF:
        //   If on /maintenance -> Redirect to /

        const isAdmin = session?.user; // Adjust this check based on your auth implementation

        if (settings.maintenanceMode) {
            if (!isAdmin && !isMaintenancePage && !isAdminRoute && !isApiRoute && !isAuthRoute) {
                router.push("/maintenance");
            }
        } else {
            if (isMaintenancePage) {
                router.push("/");
            }
        }

    }, [settings.maintenanceMode, loading, pathname, router, session, status]); // Added dependencies

    // We still render children because the router.push will happen client side.
    // Ideally we might want to return null while redirecting to avoid flash, but layout shift might be worse.
    // For maintenance, a flash of content is bad.

    if (loading) return <>{children}</>; // Or a loader

    // If we are redirecting to maintenance, we might want to hide children?
    // But basic implementation is fine for now.

    return <>{children}</>;
}
