import type { Metadata } from "next";
import LoginContent from "@/components/LoginContent";

export const metadata: Metadata = {
    title: "Admin Login - Aster Medicines PVT LTD",
    description: "Secure admin login for Aster Medicines PVT LTD dashboard.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return <LoginContent />;
}
