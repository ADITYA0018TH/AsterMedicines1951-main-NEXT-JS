"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VisitorTracker = () => {
    const pathname = usePathname();
    // Use a ref to prevent double firing in strict mode (dev) if needed, 
    // though for tracking multiple page navigations we want it to fire on change.
    // In Next.js, pathname changing will re-trigger the effect if it's in the dependency array.

    useEffect(() => {
        // Function to report visit
        const reportVisit = async () => {
            try {
                await fetch('/api/track-visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer || 'Direct',
                        screenResolution: `${window.screen.width}x${window.screen.height}`,
                        language: navigator.language,
                    }),
                });
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        reportVisit();
    }, [pathname]);

    return null; // This component renders nothing
};

export default VisitorTracker;
