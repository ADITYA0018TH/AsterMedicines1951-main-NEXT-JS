import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { z } from 'zod';
import {
  sanitizeAssetPath,
  sanitizeEmail,
  sanitizeTextForStorage,
  sanitizeUrl,
} from '@/lib/inputSecurity';

const optionalText = (maxLength: number) =>
  z.string().max(maxLength).optional().transform((value) => {
    if (typeof value !== 'string') {
      return undefined;
    }
    const sanitized = sanitizeTextForStorage(value, maxLength);
    return sanitized || undefined;
  });

const optionalUrl = z.string().max(2048).optional().transform((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const sanitized = sanitizeUrl(value, 2048);
  return sanitized || undefined;
});

const optionalEmail = z.string().email('Invalid email address').or(z.literal('')).optional().transform((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const sanitized = sanitizeEmail(value);
  return sanitized || undefined;
});

const optionalAssetPath = z.string().max(255).optional().transform((value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const assetPath = sanitizeAssetPath(value, 255);
  const remoteUrl = sanitizeUrl(value, 255);
  return assetPath || remoteUrl || undefined;
});

const homepagePhoto = z.object({
  src: z.string().max(2048).refine(src => src === "" || /^https:\/\/res\.cloudinary\.com\//.test(src) || /^\/uploads\/[a-zA-Z0-9._/-]+$/.test(src) && !src.includes("..")),
  alt: z.string().trim().max(250),
}).refine(photo => !photo.src || !!photo.alt, "Describe the uploaded image");

const settingsUpdateSchema = z.object({
  homepageImages: z.object({ hero: homepagePhoto.optional(), manufacturing: homepagePhoto.optional() }).optional(),
  contact: z.object({
    phone: optionalText(32),
    email: optionalEmail,
    address: optionalText(500),
    registeredOffice: optionalText(500),
    mapLink: optionalUrl,
    supportEmail: optionalEmail,
    hrEmail: optionalEmail,
  }).partial().optional(),
  social: z.object({
    facebook: optionalUrl,
    twitter: optionalUrl,
    instagram: optionalUrl,
    linkedin: optionalUrl,
    youtube: optionalUrl,
  }).partial().optional(),
  maintenanceMode: z.boolean().optional(),
  about: z.object({
    founderImage: optionalAssetPath,
  }).partial().optional(),
  meta: z.object({
    title: optionalText(180),
    description: optionalText(500),
  }).partial().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required for update');

export async function GET() {
  try {
    await connectDB();
    
    // Find the single settings document
    let settings = await Settings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({
        contact: {
            phone: "+91 7909071165",
            email: "astermedicinespvtltd@gmail.com",
            address: "E-4 Part, Phase-2, Industrial Area, Hajipur, Vaishali, Bihar-844102",
            mapLink: "https://maps.app.goo.gl/hQDTvWxUv5rqNafW7",
            supportEmail: "accounts@astermedicines.com",
            hrEmail: "hr@astermedicines.com"
        },
        social: {
            instagram: "https://www.instagram.com/aster_medicines?igsh=MTRwODV4bXJwM3BtMg==",
            youtube: "https://www.youtube.com/@astermedicines13"
        },
        meta: {
            title: "Aster Medicines - Pharmaceutical Manufacturer",
            description: "Advancing global health with high-quality pharmaceutical solutions. Trusted since 1982."
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !("role" in session.user) || session.user.role !== "admin") {
    return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
  }
  try {
    await connectDB();
    const parsedBody = settingsUpdateSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    // Update the single settings document (upsert ensures it's created if missing, though GET handles creation mainly)
    const settings = await Settings.findOneAndUpdate({}, { $set: parsedBody.data }, {
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
