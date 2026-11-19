"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Save,
    Loader2,
    Globe,
    Phone,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    AlertTriangle,
    Edit,
    Upload,
    Download,
    ExternalLink,
    RotateCcw,
    Copy,
    Database,
    Play,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { homepageImage, type HomepageSlot } from "@/data/homepageImages";
import { useSettings } from "@/context/SettingsContext";
import type { HomepageImages } from "@/data/homepageImages";

import { registeredOffice } from "@/data/companyLocations";

interface SettingsData {
    homepageImages?: HomepageImages;
    contact: {
        phone: string;
        email: string;
        address: string;
        registeredOffice?: string;
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

interface SlugBackfillResult {
    dryRun: boolean;
    scanned: number;
    updated: number;
    unchanged: number;
    failed: number;
    updates: Array<{
        id: string;
        name: string;
        previousSlug: string | null;
        nextSlug: string;
    }>;
    failures: Array<{
        id: string;
        name: string;
        reason: string;
    }>;
}

const DEFAULT_SETTINGS: SettingsData = {
    contact: {
        phone: "",
        email: "",
        address: "",
        registeredOffice,
        mapLink: "",
        supportEmail: "",
        hrEmail: "",
    },
    social: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
    },
    maintenanceMode: false,
    meta: {
        title: "",
        description: "",
    },
    about: {
        founderImage: "/uploads/DP.webp",
    },
};

const SOCIAL_FIELDS: Array<{
    key: keyof SettingsData["social"];
    label: string;
    icon: typeof Facebook;
}> = [
    { key: "facebook", label: "Facebook URL", icon: Facebook },
    { key: "twitter", label: "Twitter/X URL", icon: Twitter },
    { key: "instagram", label: "Instagram URL", icon: Instagram },
    { key: "linkedin", label: "LinkedIn URL", icon: Linkedin },
    { key: "youtube", label: "YouTube URL", icon: Youtube },
];

const normalizeSettings = (data?: Partial<SettingsData>): SettingsData => ({
    homepageImages: data?.homepageImages || {},
    contact: {
        ...DEFAULT_SETTINGS.contact,
        ...(data?.contact || {}),
    },
    social: {
        ...DEFAULT_SETTINGS.social,
        ...(data?.social || {}),
    },
    maintenanceMode:
        typeof data?.maintenanceMode === "boolean"
            ? data.maintenanceMode
            : DEFAULT_SETTINGS.maintenanceMode,
    meta: {
        ...DEFAULT_SETTINGS.meta,
        ...(data?.meta || {}),
    },
    about: {
        ...DEFAULT_SETTINGS.about,
        ...(data?.about || {}),
    },
});

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidUrl = (value: string) => {
    if (!value.trim()) return true;
    try {
        const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
        new URL(normalized);
        return true;
    } catch {
        return false;
    }
};

const validateSettings = (settings: SettingsData) => {
    const nextErrors: Record<string, string> = {};

    if (!settings.contact.phone.trim()) {
        nextErrors["contact.phone"] = "Phone is required";
    }

    if (!settings.contact.email.trim()) {
        nextErrors["contact.email"] = "Main email is required";
    } else if (!isValidEmail(settings.contact.email)) {
        nextErrors["contact.email"] = "Enter a valid email";
    }

    if (settings.contact.supportEmail && !isValidEmail(settings.contact.supportEmail)) {
        nextErrors["contact.supportEmail"] = "Enter a valid support email";
    }

    if (settings.contact.hrEmail && !isValidEmail(settings.contact.hrEmail)) {
        nextErrors["contact.hrEmail"] = "Enter a valid HR email";
    }

    if (settings.contact.mapLink && !isValidUrl(settings.contact.mapLink)) {
        nextErrors["contact.mapLink"] = "Enter a valid map URL";
    }

    if (!settings.contact.address.trim()) {
        nextErrors["contact.address"] = "Address is required";
    }

    SOCIAL_FIELDS.forEach((field) => {
        const value = settings.social[field.key];
        if (value && !isValidUrl(value)) {
            nextErrors[`social.${field.key}`] = `Enter a valid ${field.label}`;
        }
    });

    if (!settings.meta.title.trim()) {
        nextErrors["meta.title"] = "Site title is required";
    }

    if (!settings.meta.description.trim()) {
        nextErrors["meta.description"] = "Meta description is required";
    }

    return nextErrors;
};

const AdminSettingsContent = () => {
    const { refreshSettings } = useSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [lastSavedAt, setLastSavedAt] = useState("");
    const [slugBackfillLimit, setSlugBackfillLimit] = useState("500");
    const [slugBackfillRunning, setSlugBackfillRunning] = useState<"dry-run" | "apply" | null>(null);
    const [slugBackfillResult, setSlugBackfillResult] = useState<SlugBackfillResult | null>(null);

    const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
    const [initialSettings, setInitialSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

    const hasUnsavedChanges = useMemo(() => {
        return JSON.stringify(settings) !== JSON.stringify(initialSettings);
    }, [settings, initialSettings]);

    const completion = useMemo(() => {
        const requiredFields = [
            settings.contact.phone,
            settings.contact.email,
            settings.contact.address,
            settings.meta.title,
            settings.meta.description,
        ];
        const filledRequired = requiredFields.filter((field) => field.trim()).length;

        const optionalLinks = [
            settings.contact.mapLink,
            settings.social.facebook,
            settings.social.twitter,
            settings.social.instagram,
            settings.social.linkedin,
            settings.social.youtube,
        ].filter((field) => field.trim()).length;

        return {
            filledRequired,
            totalRequired: requiredFields.length,
            optionalLinks,
            progressPercent: Math.round((filledRequired / requiredFields.length) * 100),
        };
    }, [settings]);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const beforeUnload = (event: BeforeUnloadEvent) => {
            if (!isEditing || !hasUnsavedChanges) return;
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", beforeUnload);
        return () => window.removeEventListener("beforeunload", beforeUnload);
    }, [isEditing, hasUnsavedChanges]);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (!res.ok) {
                toast.error("Failed to load settings");
                return;
            }

            const data = await res.json();
            const normalized = normalizeSettings(data);
            setSettings(normalized);
            setInitialSettings(normalized);
            setLastSavedAt(new Date().toISOString());
        } catch (error) {
            console.error(error);
            toast.error("Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (Object.values(settings.homepageImages || {}).some(photo => photo.src && !photo.alt.trim())) {
            toast.error("Add alt text for each uploaded homepage image");
            return;
        }
        const validationErrors = validateSettings(settings);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Fix validation errors before saving");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!res.ok) {
                toast.error("Failed to save settings");
                return;
            }

            const normalized = normalizeSettings(settings);
            setSettings(normalized);
            setInitialSettings(normalized);
            setErrors({});
            setIsEditing(false);
            setLastSavedAt(new Date().toISOString());
            await refreshSettings();
            toast.success("Settings saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section: keyof SettingsData, field: string, value: string | boolean) => {
        setSettings((prev) => {
            const sectionData = prev[section];
            if (typeof sectionData !== "object" || sectionData === null) return prev;

            return {
                ...prev,
                [section]: {
                    ...(sectionData as Record<string, unknown>),
                    [field]: value,
                },
            };
        });

        const errorKey = `${String(section)}.${field}`;
        setErrors((prev) => {
            if (!prev[errorKey]) return prev;
            const next = { ...prev };
            delete next[errorKey];
            return next;
        });
    };

    const handleDiscardChanges = () => {
        if (hasUnsavedChanges && !window.confirm("Discard unsaved changes?")) return;
        setSettings(initialSettings);
        setErrors({});
        setIsEditing(false);
    };

    const handleExportJson = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], {
            type: "application/json;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `site_settings_${new Date().toISOString().split("T")[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Settings exported");
    };

    const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const normalized = normalizeSettings(parsed);
            setSettings(normalized);
            setErrors({});
            setIsEditing(true);
            toast.success("Settings imported. Review and save changes.");
        } catch (error) {
            console.error(error);
            toast.error("Invalid JSON file");
        } finally {
            setImporting(false);
            event.target.value = "";
        }
    };

    const openExternalLink = (url: string, label: string) => {
        if (!url.trim()) {
            toast.info(`${label} is empty`);
            return;
        }

        const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        window.open(normalized, "_blank", "noopener,noreferrer");
    };

    const handleCopyEmails = async () => {
        const bundle = [settings.contact.email, settings.contact.supportEmail, settings.contact.hrEmail]
            .filter((value) => value && value.trim())
            .join("\n");

        if (!bundle) {
            toast.info("No email addresses to copy");
            return;
        }

        try {
            await navigator.clipboard.writeText(bundle);
            toast.success("Emails copied to clipboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to copy emails");
        }
    };

    const handleSlugBackfill = async (dryRun: boolean) => {
        const parsedLimit = Number.parseInt(slugBackfillLimit, 10);
        const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

        setSlugBackfillRunning(dryRun ? "dry-run" : "apply");
        try {
            const response = await fetch("/api/admin/products/backfill-slugs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ dryRun, limit }),
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = typeof payload?.message === "string"
                    ? payload.message
                    : "Backfill request failed";
                toast.error(message);
                return;
            }

            const result = payload?.result as SlugBackfillResult;
            if (result && typeof result === "object") {
                setSlugBackfillResult(result);
                const modeLabel = dryRun ? "Dry run" : "Backfill";
                toast.success(
                    `${modeLabel} complete: ${result.updated} updated, ${result.unchanged} unchanged, ${result.failed} failed`
                );
            } else {
                toast.success(dryRun ? "Dry run completed" : "Slug backfill completed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error while running slug backfill");
        } finally {
            setSlugBackfillRunning(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="glass-card p-6 md:p-8 animate-enter">
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" onClick={() => (window.location.href = "/admin/dashboard")}>← Back</Button>
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Site Settings</h1>
                                        <p className="text-muted-foreground">Manage global website configuration.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            hasUnsavedChanges
                                                ? "bg-primary/15 text-primary border-primary/30"
                                                : "bg-card text-muted-foreground"
                                        )}
                                    >
                                        {hasUnsavedChanges ? "Unsaved Changes" : "All Changes Saved"}
                                    </Badge>

                                    <Button variant="outline" onClick={handleExportJson} className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Export JSON
                                    </Button>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="application/json"
                                            onChange={handleImportJson}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            disabled={importing}
                                        />
                                        <Button variant="outline" className="gap-2" disabled={importing}>
                                            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            Import JSON
                                        </Button>
                                    </div>

                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)} className="gap-2">
                                            <Edit className="h-4 w-4" />
                                            Edit Settings
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" onClick={handleDiscardChanges} disabled={saving} className="gap-2">
                                                <RotateCcw className="h-4 w-4" />
                                                Discard
                                            </Button>
                                            <Button onClick={handleSave} disabled={saving} className="gap-2">
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                Save Changes
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <span>
                                    Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString("en-IN") : "Not saved yet"}
                                </span>
                                <span>
                                    Completion: {completion.filledRequired}/{completion.totalRequired} required fields
                                </span>
                            </div>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <Card className="mb-6 border-destructive/40 bg-destructive/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-destructive flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Validation issues ({Object.keys(errors).length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-destructive grid gap-1">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <p key={key}>• {message}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuration Health</CardTitle>
                                    <CardDescription>Quick progress and link checks.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Required fields completion</span>
                                            <span className="font-semibold text-foreground">{completion.progressPercent}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{ width: `${completion.progressPercent}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openExternalLink(settings.contact.mapLink, "Map link")}>
                                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                            Test factory map link
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openExternalLink(settings.social.facebook, "Facebook link")}>
                                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                            Test Facebook
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openExternalLink(settings.social.linkedin, "LinkedIn link")}>
                                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                            Test LinkedIn
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleCopyEmails}>
                                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                                            Copy Email Bundle
                                        </Button>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Optional links filled: {completion.optionalLinks}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5 text-primary" />
                                        Slug Maintenance
                                    </CardTitle>
                                    <CardDescription>
                                        Dry-run and backfill canonical product slugs for all database records.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                        <div className="space-y-2 md:col-span-1">
                                            <Label>Scan Limit</Label>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={50000}
                                                value={slugBackfillLimit}
                                                onChange={(e) => setSlugBackfillLimit(e.target.value)}
                                                placeholder="500"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2 md:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="gap-2"
                                                disabled={slugBackfillRunning !== null}
                                                onClick={() => handleSlugBackfill(true)}
                                            >
                                                {slugBackfillRunning === "dry-run" ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                                Dry Run
                                            </Button>
                                            <Button
                                                type="button"
                                                className="gap-2"
                                                disabled={slugBackfillRunning !== null}
                                                onClick={() => handleSlugBackfill(false)}
                                            >
                                                {slugBackfillRunning === "apply" ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Database className="h-4 w-4" />
                                                )}
                                                Run Backfill
                                            </Button>
                                        </div>
                                    </div>

                                    {slugBackfillResult && (
                                        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                                            <p className="font-medium text-foreground">
                                                Last run: {slugBackfillResult.dryRun ? "Dry run" : "Applied"}
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-muted-foreground">
                                                <span>Scanned: {slugBackfillResult.scanned}</span>
                                                <span>Updated: {slugBackfillResult.updated}</span>
                                                <span>Unchanged: {slugBackfillResult.unchanged}</span>
                                                <span>Failed: {slugBackfillResult.failed}</span>
                                                <span>Changes: {slugBackfillResult.updates.length}</span>
                                            </div>
                                            {slugBackfillResult.failures.length > 0 && (
                                                <p className="text-destructive text-xs">
                                                    Failures detected. Check server logs for details.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-primary" />
                                        Contact Information
                                    </CardTitle>
                                    <CardDescription>Details displayed in header, footer, and contact page.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.contact.phone}
                                            onChange={(e) => handleChange("contact", "phone", e.target.value)}
                                            placeholder="+91 1234567890"
                                            className={cn(errors["contact.phone"] && "border-destructive")}
                                        />
                                        {errors["contact.phone"] && <p className="text-xs text-destructive">{errors["contact.phone"]}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Main Email</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings.contact.email}
                                                onChange={(e) => handleChange("contact", "email", e.target.value)}
                                                placeholder="info@example.com"
                                                className={cn(errors["contact.email"] && "border-destructive")}
                                            />
                                            {errors["contact.email"] && <p className="text-xs text-destructive">{errors["contact.email"]}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>HR Email</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings.contact.hrEmail}
                                                onChange={(e) => handleChange("contact", "hrEmail", e.target.value)}
                                                placeholder="hr@example.com"
                                                className={cn(errors["contact.hrEmail"] && "border-destructive")}
                                            />
                                            {errors["contact.hrEmail"] && <p className="text-xs text-destructive">{errors["contact.hrEmail"]}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Support/Accounts Email</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.contact.supportEmail}
                                            onChange={(e) => handleChange("contact", "supportEmail", e.target.value)}
                                            placeholder="support@example.com"
                                            className={cn(errors["contact.supportEmail"] && "border-destructive")}
                                        />
                                        {errors["contact.supportEmail"] && <p className="text-xs text-destructive">{errors["contact.supportEmail"]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registered-office">Registered office address</Label>
                                        <Textarea id="registered-office" disabled={!isEditing} maxLength={500} value={settings.contact.registeredOffice ?? registeredOffice} placeholder={registeredOffice}
                                            onChange={e => handleChange("contact", "registeredOffice", e.target.value)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="factory-address">Factory address</Label>
                                        <Textarea
                                            id="factory-address" disabled={!isEditing}
                                            value={settings.contact.address}
                                            onChange={(e) => handleChange("contact", "address", e.target.value)}
                                            placeholder="123 Street Name, City, Country"
                                            rows={3}
                                            className={cn(errors["contact.address"] && "border-destructive")}
                                        />
                                        {errors["contact.address"] && <p className="text-xs text-destructive">{errors["contact.address"]}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="factory-map">Factory map link</Label>
                                        <Input
                                            id="factory-map" disabled={!isEditing}
                                            value={settings.contact.mapLink}
                                            onChange={(e) => handleChange("contact", "mapLink", e.target.value)}
                                            placeholder="https://maps.app.goo.gl/..."
                                            className={cn(errors["contact.mapLink"] && "border-destructive")}
                                        />
                                        {errors["contact.mapLink"] && <p className="text-xs text-destructive">{errors["contact.mapLink"]}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-primary" />
                                        Social Media Links
                                    </CardTitle>
                                    <CardDescription>Links to your social profiles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4">
                                        {SOCIAL_FIELDS.map((socialField) => {
                                            const Icon = socialField.icon;
                                            const errorKey = `social.${socialField.key}`;
                                            return (
                                                <div key={socialField.key} className="space-y-1.5">
                                                    <div className="flex items-center gap-3">
                                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                                        <Input
                                                            disabled={!isEditing}
                                                            className={cn("flex-1", errors[errorKey] && "border-destructive")}
                                                            placeholder={socialField.label}
                                                            value={settings.social[socialField.key]}
                                                            onChange={(e) => handleChange("social", socialField.key, e.target.value)}
                                                        />
                                                    </div>
                                                    {errors[errorKey] && <p className="text-xs text-destructive pl-8">{errors[errorKey]}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Homepage images</CardTitle></CardHeader>
                                <CardContent className="grid gap-8 lg:grid-cols-2">
                                    {(["hero", "manufacturing"] as HomepageSlot[]).map(slot => {
                                        const custom = settings.homepageImages?.[slot];
                                        const preview = homepageImage(settings.homepageImages, slot);
                                        const update = (src: string, alt: string) => setSettings(prev => ({
                                            ...prev, homepageImages: { ...prev.homepageImages, [slot]: { src, alt } },
                                        }));
                                        return <fieldset key={slot} className="min-w-0 space-y-3">
                                            <legend className="font-semibold">{slot === "hero" ? "Homepage hero" : "Manufacturing section"}</legend>
                                            <ImageUpload folder="aster-medicines/homepage" value={custom?.src} disabled={!isEditing} onChange={src => update(src, "")}/>
                                            <Label htmlFor={slot + "-alt"}>Image description (alt text)</Label>
                                            <Input id={slot + "-alt"} value={preview.alt} maxLength={250} disabled={!isEditing || !custom?.src} onChange={e => update(custom?.src || "", e.target.value)}/>
                                            <div className="flex items-end gap-3">
                                                {["Desktop","Mobile"].map(device => <figure key={device} className={device === "Mobile" ? "w-1/3" : "w-2/3"}>
                                                    <img src={preview.src} alt={preview.alt} className={`w-full rounded-lg object-cover ${slot === "hero" ? "aspect-[4/3]" : device === "Mobile" ? "aspect-[350/268]" : "aspect-[628/464]"}`}/>
                                                    <figcaption className="text-sm text-muted-foreground">{device} preview</figcaption>
                                                </figure>)}
                                            </div>
                                            <Button type="button" variant="outline" disabled={!isEditing || !custom?.src} onClick={() => update("", "")}>Restore default</Button>
                                        </fieldset>;
                                    })}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>About Section</CardTitle>
                                    <CardDescription>Manage content for the About page.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Founder Image</Label>
                                        <div className="max-w-md">
                                            <ImageUpload
                                                value={settings.about?.founderImage || ""}
                                                onChange={(url) => handleChange("about" as keyof SettingsData, "founderImage", url)}
                                                disabled={!isEditing}
                                                folder="aster-medicines/about"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Upload a new image or paste a URL below.
                                        </p>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.about?.founderImage || ""}
                                            onChange={(e) => handleChange("about" as keyof SettingsData, "founderImage", e.target.value)}
                                            placeholder="or paste image URL..."
                                            className="mt-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-destructive/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="h-5 w-5" />
                                        DANGER ZONE
                                    </CardTitle>
                                    <CardDescription>Controls for site availability.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable to show a &quot;Under Maintenance&quot; page to all non-admin visitors.
                                        </p>
                                    </div>
                                    <Switch
                                        disabled={!isEditing}
                                        checked={settings.maintenanceMode}
                                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>SEO Defaults</CardTitle>
                                    <CardDescription>Default meta tags for the site.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Site Title</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.meta.title}
                                            onChange={(e) => handleChange("meta", "title", e.target.value)}
                                            className={cn(errors["meta.title"] && "border-destructive")}
                                        />
                                        {errors["meta.title"] && <p className="text-xs text-destructive">{errors["meta.title"]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Meta Description</Label>
                                            <span className="text-xs text-muted-foreground">{settings.meta.description.length}/160 recommended</span>
                                        </div>
                                        <Textarea
                                            disabled={!isEditing}
                                            value={settings.meta.description}
                                            onChange={(e) => handleChange("meta", "description", e.target.value)}
                                            rows={3}
                                            className={cn(errors["meta.description"] && "border-destructive")}
                                        />
                                        {errors["meta.description"] && <p className="text-xs text-destructive">{errors["meta.description"]}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
                .animate-enter {
                    animation: fade-up 0.35s ease-out both;
                }

                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminSettingsContent;
