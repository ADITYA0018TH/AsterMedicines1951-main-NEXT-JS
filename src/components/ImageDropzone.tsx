import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
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

        try {
            const response = await fetch('http://localhost:3000/api/upload', {
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
                            className="relative group aspect-square rounded-lg overflow-hidden glass-panel border border-gray-200"
                        >
                            <Image
                                src={url}
                                alt={`Product ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs truncate">
                                    Image {index + 1}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
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
