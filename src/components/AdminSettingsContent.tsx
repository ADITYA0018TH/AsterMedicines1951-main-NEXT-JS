"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Loader2, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, AlertTriangle, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";

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

const AdminSettingsContent = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState<SettingsData>({
        contact: { phone: '', email: '', address: '', mapLink: '', supportEmail: '', hrEmail: '' },
        social: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
        maintenanceMode: false,
        meta: { title: '', description: '' },
        about: { founderImage: '' }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                // Merge with defaults to ensure all fields exist
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    about: data.about || { founderImage: '/uploads/DP.webp' }
                }));
            } else {
                toast.error("Failed to load settings");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success("Settings saved successfully");
                setIsEditing(false);
                // Update local storage or trigger a re-fetch if using context in future
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section: keyof SettingsData, field: string, value: string | boolean) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="glass-card p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={() => window.location.href = '/admin/dashboard'}>
                                    ← Back
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Site Settings</h1>
                                    <p className="text-gray-500 dark:text-gray-400">Manage global website configuration.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                                        <Edit className="h-4 w-4" />
                                        Edit Settings
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} disabled={saving} className="gap-2">
                                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Save Changes
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6">

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-blue-500" />
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
                                            onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                                            placeholder="+91 1234567890"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Main Email</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings.contact.email}
                                                onChange={(e) => handleChange('contact', 'email', e.target.value)}
                                                placeholder="info@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>HR Email</Label>
                                            <Input
                                                disabled={!isEditing}
                                                value={settings.contact.hrEmail}
                                                onChange={(e) => handleChange('contact', 'hrEmail', e.target.value)}
                                                placeholder="hr@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Support/Accounts Email</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.contact.supportEmail}
                                            onChange={(e) => handleChange('contact', 'supportEmail', e.target.value)}
                                            placeholder="support@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Textarea
                                            disabled={!isEditing}
                                            value={settings.contact.address}
                                            onChange={(e) => handleChange('contact', 'address', e.target.value)}
                                            placeholder="123 Street Name, City, Country"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Google Maps Link</Label>
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.contact.mapLink}
                                            onChange={(e) => handleChange('contact', 'mapLink', e.target.value)}
                                            placeholder="https://maps.app.goo.gl/..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Media */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-green-500" />
                                        Social Media Links
                                    </CardTitle>
                                    <CardDescription>Links to your social profiles.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3">
                                            <Facebook className="h-5 w-5 text-blue-600" />
                                            <Input
                                                disabled={!isEditing}
                                                className="flex-1"
                                                placeholder="Facebook URL"
                                                value={settings.social.facebook}
                                                onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Twitter className="h-5 w-5 text-sky-500" />
                                            <Input
                                                disabled={!isEditing}
                                                className="flex-1"
                                                placeholder="Twitter/X URL"
                                                value={settings.social.twitter}
                                                onChange={(e) => handleChange('social', 'twitter', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Instagram className="h-5 w-5 text-pink-600" />
                                            <Input
                                                disabled={!isEditing}
                                                className="flex-1"
                                                placeholder="Instagram URL"
                                                value={settings.social.instagram}
                                                onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Linkedin className="h-5 w-5 text-blue-700" />
                                            <Input
                                                disabled={!isEditing}
                                                className="flex-1"
                                                placeholder="LinkedIn URL"
                                                value={settings.social.linkedin}
                                                onChange={(e) => handleChange('social', 'linkedin', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Youtube className="h-5 w-5 text-red-600" />
                                            <Input
                                                disabled={!isEditing}
                                                className="flex-1"
                                                placeholder="YouTube URL"
                                                value={settings.social.youtube}
                                                onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* About Section */}
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
                                                value={settings.about?.founderImage || ''}
                                                onChange={(url) => handleChange('about' as any, 'founderImage', url)}
                                                disabled={!isEditing}
                                                folder="aster-medicines/about"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Upload a new image or paste a URL below.
                                        </p>
                                        {/* Optional Manual Input Fallback */}
                                        <Input
                                            disabled={!isEditing}
                                            value={settings.about?.founderImage || ''}
                                            onChange={(e) => handleChange('about' as any, 'founderImage', e.target.value)}
                                            placeholder="or paste image URL..."
                                            className="mt-2"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Maintenance Mode */}
                            <Card className="border-red-200 dark:border-red-900/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <AlertTriangle className="h-5 w-5" />
                                        DANGER ZONE
                                    </CardTitle>
                                    <CardDescription>Controls for site availability.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Maintenance Mode</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Enable to show a "Under Maintenance" page to all non-admin visitors.
                                        </p>
                                    </div>
                                    <Switch
                                        disabled={!isEditing}
                                        checked={settings.maintenanceMode}
                                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                                    />
                                </CardContent>
                            </Card>

                            {/* SEO / Meta */}
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
                                            onChange={(e) => handleChange('meta', 'title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Meta Description</Label>
                                        <Textarea
                                            disabled={!isEditing}
                                            value={settings.meta.description}
                                            onChange={(e) => handleChange('meta', 'description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default AdminSettingsContent;
