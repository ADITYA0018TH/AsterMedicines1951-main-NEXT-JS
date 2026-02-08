"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsData {
    contact: {
        phone: string;
        email: string;
        address: string;
        mapLink: string;
        supportEmail?: string;
        hrEmail?: string;
    };
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    };
    maintenanceMode: boolean;
    meta: {
        title: string;
        description: string;
    };
    about?: {
        founderImage: string;
    };
}

const defaultSettings: SettingsData = {
    contact: { phone: '', email: '', address: '', mapLink: '' },
    social: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
    maintenanceMode: false,
    meta: { title: '', description: '' },
    about: { founderImage: '' }
};

interface SettingsContextType {
    settings: SettingsData;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true,
    refreshSettings: async () => { },
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
