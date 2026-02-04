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
    
    // If x-forwarded-for contains multiple IPs, take the first one
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }
    
    // Fallback for localhost
    if (!ip || ip === '::1') {
        ip = '127.0.0.1';
    }

    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // Parse User Agent for Device Info
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Construct readable device string
    let deviceName = 'Desktop'; // Default
    
    // Check for specific device info
    if (result.device.model || result.device.type) {
        const vendor = result.device.vendor || '';
        const model = result.device.model || '';
        const type = result.device.type || '';
        
        // Handle Mac specifically as it often reports just model='Macintosh'
        if (model === 'Macintosh') {
             deviceName = `Apple Mac`;
        } else {
             deviceName = `${vendor} ${model}`.trim() || type;
        }
    }
    
    // Append OS for better context (e.g., "Apple Mac (macOS 10.15.7)")
    if (result.os.name) {
         if (deviceName === 'Desktop') {
             deviceName = `${result.os.name} ${result.os.version || ''}`;
         } else {
             deviceName += ` (${result.os.name} ${result.os.version || ''})`;
         }
    }

    // Only append browser if generic Desktop, to avoid "Browser Name" confusion
    if (deviceName === 'Desktop' && result.browser.name) {
         deviceName += ` (${result.browser.name})`;
    } else if (!result.device.model && result.browser.name) {
        // For cases like "Windows 10", simplified browser info might be helpful but can be omitted if user prefers strict device look
        // We will keep it for generic OS names to differentiate environments
    }

    let location = undefined;
    let isp = undefined;
    let coordinates = undefined;
    
    // Only fetch location if not localhost
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
        // Mock location for localhost testing
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

    await Visitor.create({
      ip,
      userAgent,
      path,
      location,
      referrer,
      isp,
      coordinates,
      screenResolution,
      language,
      device: deviceName
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
