import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Use "My-uploads" to match the rest of the project structure
    const uploadDir = path.join(process.cwd(), 'public/My-uploads');
    
    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        console.error('Failed to create upload directory:', mkdirError);
        return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 });
      }
    }

    const imageUrls = [];

    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name;
        const ext = path.extname(originalName);
        const baseName = path.basename(originalName, ext);
        
        // Sanitize filename: replace spaces with underscores, remove non-alphanumeric chars (except - and _)
        const sanitizedBase = baseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '');
        
        let filename = `${sanitizedBase}${ext}`;
        let counter = 1;
        
        while (existsSync(path.join(uploadDir, filename))) {
          filename = `${sanitizedBase}-${counter}${ext}`;
          counter++;
        }
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);
        // Return path relative to public
        imageUrls.push(`/My-uploads/${filename}`);
      } catch (fileError) {
        console.error(`Failed to write file ${file.name}:`, fileError);
        // Continue with other files or throw? Let's just log for now and maybe return partial success or fail batch?
        // Ideally we fail the batch if one fails for consistency, or return errors.
        // For simple usage, we'll throw to catch block.
        throw fileError;
      }
    }

    return NextResponse.json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error details:', error);
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}
