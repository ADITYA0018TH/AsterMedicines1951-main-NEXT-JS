import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { sanitizeCloudinaryFolder, sanitizeFilenameBase } from '@/lib/inputSecurity';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;
const DEFAULT_UPLOAD_FOLDER = 'aster-medicines/products';
const ALLOWED_UPLOAD_FOLDERS = new Set([
  'aster-medicines/products',
  'aster-medicines/uploads',
  'aster-medicines/about',
]);

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function hasSignature(buffer: Uint8Array, signature: number[], offset = 0): boolean {
  if (buffer.length < offset + signature.length) {
    return false;
  }

  return signature.every((byte, index) => buffer[offset + index] === byte);
}

function matchesImageSignature(buffer: Uint8Array, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') {
    return hasSignature(buffer, [0xff, 0xd8, 0xff]);
  }

  if (mimeType === 'image/png') {
    return hasSignature(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }

  if (mimeType === 'image/gif') {
    return hasSignature(buffer, [0x47, 0x49, 0x46, 0x38]);
  }

  if (mimeType === 'image/webp') {
    return hasSignature(buffer, [0x52, 0x49, 0x46, 0x46]) && hasSignature(buffer, [0x57, 0x45, 0x42, 0x50], 8);
  }

  return false;
}

function resolveFolder(value: FormDataEntryValue | null): string {
  const requestedFolder = sanitizeCloudinaryFolder(value);
  if (ALLOWED_UPLOAD_FOLDERS.has(requestedFolder)) {
    return requestedFolder;
  }

  return DEFAULT_UPLOAD_FOLDER;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll('images');

    if (rawFiles.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (rawFiles.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES_PER_REQUEST} files allowed per request` }, { status: 400 });
    }

    if (!rawFiles.every((entry) => entry instanceof File)) {
      return NextResponse.json({ error: 'Invalid file payload' }, { status: 400 });
    }

    const files = rawFiles as File[];

    const folder = resolveFolder(formData.get('folder'));

    const uploadPromises = files.map(async (file) => {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        throw new Error('Unsupported image MIME type');
      }

      if (file.size <= 0) {
        throw new Error('File is empty');
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Each image must be 5MB or smaller');
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!matchesImageSignature(buffer, file.type)) {
        throw new Error('File content does not match declared MIME type');
      }

      const filenameBase = sanitizeFilenameBase(file.name.replace(/\.[^/.]+$/, ''), 'image');
      const filename = `${filenameBase}-${randomUUID()}`;

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: filename,
            use_filename: false,
            unique_filename: false,
            overwrite: false,
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            format: 'webp',
            transformation: [{ quality: 'auto' }]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result?.secure_url || '');
            }
          }
        );
        uploadStream.end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error details:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload images';
    const validationErrors = new Set([
      'Unsupported image MIME type',
      'File is empty',
      'Each image must be 5MB or smaller',
      'File content does not match declared MIME type',
    ]);
    const status = validationErrors.has(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
