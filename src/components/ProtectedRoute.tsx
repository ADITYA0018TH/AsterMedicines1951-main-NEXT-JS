"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (!isAuthenticated) {
            router.replace("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
};

export default ProtectedRoute;
