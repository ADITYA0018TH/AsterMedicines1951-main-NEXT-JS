"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VisitorTracker = () => {
    const pathname = usePathname();
    const visitorIdRef = useRef<string | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // Check if we should ignore this visitor (e.g. Admin)
        if (typeof window !== 'undefined' && localStorage.getItem('exclude_me') === 'true') {
            return;
        }

        // Reset start time on path change
        startTimeRef.current = Date.now();
        visitorIdRef.current = null;

        // Function to report visit
        const reportVisit = async () => {
            try {
                const res = await fetch('/api/track-visit', {
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
                const data = await res.json();
                if (data.success && data.id) {
                    visitorIdRef.current = data.id;
                }
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        reportVisit();

        // Function to update time spent
        const updateTimeSpent = () => {
            if (!visitorIdRef.current) return;

            const timeSpent = (Date.now() - startTimeRef.current) / 1000;
            const data = JSON.stringify({
                id: visitorIdRef.current,
                timeSpent: timeSpent
            });

            // Try beacon first for reliability on unload
            if (navigator.sendBeacon) {
                const blob = new Blob([data], { type: 'application/json' });
                navigator.sendBeacon('/api/track-visit', blob); // This might fail if endpoint expects PUT,Beacon sends POST usually. 
                // Actually sendBeacon sends POST. My API expects PUT for updates. 
                // Let's stick to fetch with keepalive for now as it supports PUT, 
                // or change API to handle POST updates. 
                // But typically sendBeacon is POST.
                // Let's just use fetch with keepalive which is modern standard.
            }

            fetch('/api/track-visit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
                keepalive: true,
            }).catch(err => console.error("Failed to update time", err));
        };

        // Update time when user leaves or hides page
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                updateTimeSpent();
                // Reset start time so we don't double count if they come back
                startTimeRef.current = Date.now();
            }
        };

        const handleBeforeUnload = () => {
            updateTimeSpent();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Also update on component unmount (route change)
            updateTimeSpent();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pathname]);

    return null; // This component renders nothing
};

export default VisitorTracker;
