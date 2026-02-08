"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    folder?: string;
}

export function ImageUpload({ value, onChange, disabled, folder = "aster-medicines/uploads" }: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (disabled) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Image size should be less than 5MB");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("images", file); // API expects 'images' field

        // Note: The current API route might hardcode the folder. 
        // Ideally we'd pass 'folder' in formData too if API supported it.

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Upload failed");
            }

            const data = await res.json();
            if (data.success && data.images && data.images.length > 0) {
                onChange(data.images[0]);
                toast.success("Image uploaded successfully");
            } else {
                throw new Error("No image URL returned");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-4 w-full">
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-colors
                    ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={disabled || uploading}
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm">Uploading...</span>
                    </div>
                ) : value ? (
                    <div className="relative w-full aspect-video md:aspect-[3/1] max-h-[200px] overflow-hidden rounded-md bg-muted/50 group">
                        <Image
                            src={value}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-medium text-sm">Click or Drop to replace</p>
                        </div>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            disabled={disabled}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground text-center">
                        <div className="p-3 bg-muted rounded-full">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                Drag & drop or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Supported formats: JPG, PNG, WEBP (Max 5MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input fallback for manual URL entry can be added here if needed, 
                but user specifically asked for drag and drop */}
        </div>
    );
}
