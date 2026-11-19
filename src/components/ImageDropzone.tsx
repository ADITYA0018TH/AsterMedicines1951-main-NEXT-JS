import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageDropzoneProps {
    onImagesUploaded: (urls: string[]) => void;
    existingImages?: string[];
    maxFiles?: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
    onImagesUploaded,
    existingImages = [],
    maxFiles = 10
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(existingImages);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [pinnedImage, setPinnedImage] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setImages(existingImages);
    }, [existingImages]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPinnedImage(null);
                setHoveredImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const activePreview = pinnedImage || hoveredImage;

    const uploadImages = async (files: File[]) => {
        if (files.length === 0) return;

        if (images.length + files.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} images allowed`);
            return;
        }

        setUploading(true);
        const formData = new FormData();

        files.forEach(file => {
            formData.append('images', file);
        });
        formData.append('folder', 'aster-medicines/products');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            const newImages = [...images, ...data.images];
            setImages(newImages);
            onImagesUploaded(newImages);
            toast.success(`${files.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length === 0) {
            toast.error('Please drop image files only');
            return;
        }

        uploadImages(files);
    }, [images, maxFiles]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        uploadImages(files);
        e.target.value = ''; // Reset input
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onImagesUploaded(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                    glass-panel hover:bg-white/20
                    ${isDragging ? 'border-pulse-500 bg-pulse-50/20 scale-[1.02]' : 'border-gray-300'}
                    ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                `}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center gap-3">
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pulse-500 border-t-transparent" />
                            <p className="text-gray-600 font-medium">Uploading images...</p>
                        </>
                    ) : (
                        <>
                            <Upload className={`h-12 w-12 ${isDragging ? 'text-pulse-500' : 'text-gray-400'} transition-colors`} />
                            <div>
                                <p className="text-gray-700 font-medium mb-1">
                                    Drag and drop images here, or click to browse
                                </p>
                                <p className="text-sm text-gray-500">
                                    PNG, JPG, GIF, WEBP up to 5MB (max {maxFiles} images)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden glass-panel border border-gray-200 cursor-zoom-in transition-all duration-200 hover:ring-2 hover:ring-brand-accent/60 shadow-sm"
                            onMouseEnter={() => setHoveredImage(url)}
                            onMouseLeave={() => setHoveredImage(null)}
                            onClick={() => setPinnedImage(url)}
                        >
                            <Image
                                src={url}
                                alt={`Product ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            {/* Zoom hint overlay */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <span className="p-2 rounded-full bg-black/60 text-white backdrop-blur-sm transform transition-transform group-hover:scale-110 shadow-md">
                                    <ZoomIn className="h-4 w-4" />
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                }}
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setHoveredImage(null);
                                }}
                                onMouseLeave={(e) => {
                                    e.stopPropagation();
                                    setHoveredImage(url);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 cursor-pointer shadow-md"
                                title="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <p className="text-white text-xs truncate font-medium">
                                    Image {index + 1}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Big Picture Modal on Hover or Click */}
            {mounted && activePreview && createPortal(
                <div
                    className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 transition-all duration-200 ${
                        pinnedImage ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                    onClick={() => setPinnedImage(null)}
                >
                    {/* Dark blurred backdrop */}
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" />

                    {/* Modal Content Box */}
                    <div
                        className="relative max-w-3xl max-h-[85vh] w-full rounded-2xl overflow-hidden bg-zinc-950/95 border border-white/20 shadow-2xl flex flex-col items-center p-4 sm:p-5 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-pulse-500 animate-pulse" />
                                <span className="text-sm sm:text-base font-semibold tracking-wide">
                                    Image Preview
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full font-medium">
                                    {pinnedImage ? 'Click outside to close' : 'Hover Preview'}
                                </span>
                                {pinnedImage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPinnedImage(null);
                                            setHoveredImage(null);
                                        }}
                                        className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Large Image Container */}
                        <div className="relative w-full h-[62vh] max-h-[550px] flex items-center justify-center">
                            <Image
                                src={activePreview}
                                alt="Enlarged Product Preview"
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 1024px) 90vw, 850px"
                                priority
                            />
                        </div>

                        {/* Footer info */}
                        <p className="mt-3 text-xs text-white/50 text-center">
                            {pinnedImage
                                ? 'Press Esc or click outside to dismiss'
                                : 'Move mouse away to close · Click image to keep open'}
                        </p>
                    </div>
                </div>,
                document.body
            )}

            {images.length === 0 && !uploading && (
                <div className="text-center py-4 glass-panel rounded-lg">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No images uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default ImageDropzone;
