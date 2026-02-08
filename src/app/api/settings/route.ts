import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

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
  try {
    await connectDB();
    const body = await req.json();

    // Update the single settings document (upsert ensures it's created if missing, though GET handles creation mainly)
    const settings = await Settings.findOneAndUpdate({}, body, { 
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
