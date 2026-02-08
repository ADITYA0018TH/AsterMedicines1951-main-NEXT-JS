import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const folder = formData.get('folder') as string || 'aster-medicines/products';

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = file.name.replace(/\.[^/.]+$/, "") + "-" + Date.now(); // Append timestamp for uniqueness

      return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: filename, // Use original filename
            use_filename: true,
            unique_filename: false, // Prevent adding random characters
            resource_type: 'auto',
            format: 'webp', // Convert to WebP
            transformation: [{ quality: 'auto' }] // Optimize quality
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
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
