import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';
import { UAParser } from 'ua-parser-js';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { path, referrer, screenResolution, language } = body;

    // Get IP address
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }
    
    if (!ip || ip === '::1') {
        ip = '127.0.0.1';
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // Parse User Agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = {
        name: result.browser.name || 'Unknown',
        version: result.browser.version || ''
    };

    const os = {
        name: result.os.name || 'Unknown',
        version: result.os.version || ''
    };

    const deviceType = result.device.type || 'desktop'; // Default to desktop if undefined

    // Construct readable device string
    let deviceName = 'Desktop'; 
    if (result.device.model) {
        deviceName = `${result.device.vendor || ''} ${result.device.model}`.trim();
    } else if (result.device.type) {
        deviceName = result.device.type;
    } else if (os.name !== 'Unknown') {
        deviceName = os.name; // Fallback to OS name
    }
    
    let location = undefined;
    let isp = undefined;
    let coordinates = undefined;
    
    if (ip !== '127.0.0.1' && ip !== 'localhost') {
        try {
            const locRes = await fetch(`http://ip-api.com/json/${ip}`);
            const locData = await locRes.json();
            if (locData.status === 'success') {
                location = {
                    city: locData.city,
                    country: locData.country,
                    region: locData.regionName
                };
                isp = locData.isp;
                coordinates = {
                    lat: locData.lat,
                    lon: locData.lon
                };
            }
        } catch (e) {
            console.error('Error fetching location:', e);
        }
    } else {
        location = {
            city: 'Patna (Dev)',
            country: 'India',
            region: 'Bihar'
        };
        isp = 'Localhost Development';
        coordinates = {
            lat: 25.594,
            lon: 85.137
        };
    }

    const newVisitor = await Visitor.create({
      ip,
      userAgent,
      path,
      location,
      referrer,
      isp,
      coordinates,
      screenResolution,
      language,
      device: deviceName,
      browser,
      os,
      deviceType,
      timeSpent: 0
    });

    return NextResponse.json({ success: true, id: newVisitor._id });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, timeSpent } = body;

        if (!id || typeof timeSpent !== 'number') {
             return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await Visitor.findByIdAndUpdate(id, {
            $inc: { timeSpent: timeSpent } // Increment existing time
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating visit duration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
