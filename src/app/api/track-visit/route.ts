import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';
import { UAParser } from 'ua-parser-js';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import {
    isValidObjectId,
    normalizeString,
    sanitizeIp,
    sanitizePath,
    sanitizeTextForStorage,
    sanitizeUrl,
} from '@/lib/inputSecurity';

// Common bot patterns to check against User-Agent
const BOT_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /ping/i, /nagios/i, /monitoring/i,
  /headless/i, /lighthouse/i, /facebookexternalhit/i, /slurp/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baiduspider/i, /duckduckbot/i
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

const trackVisitSchema = z.object({
    path: z.string().min(1).max(512).transform((value) => sanitizePath(value)),
    referrer: z.string().max(2048).optional().transform((value) => {
        if (typeof value !== 'string') {
            return undefined;
        }

        const sanitized = sanitizeUrl(value, 2048);
        return sanitized || undefined;
    }),
    screenResolution: z.string().regex(/^\d{2,5}x\d{2,5}$/, 'Invalid resolution format').optional(),
    language: z.string().regex(/^[a-zA-Z-]{2,15}$/, 'Invalid language format').optional(),
}).strict();

const updateVisitDurationSchema = z.object({
    id: z.string().refine((value) => isValidObjectId(value), 'Invalid visitor id'),
    timeSpent: z.preprocess((value) => Number(value), z.number().finite().min(0).max(86400)),
}).strict();

export async function POST(req: NextRequest) {
  // Rate limit: 60 visits per IP per minute (prevents tracking spam)
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 60, windowSec: 60 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    await connectDB();
        const parsedBody = trackVisitSchema.safeParse(await req.json());
        if (!parsedBody.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsedBody.error.format() }, { status: 400 });
    }

        const { path, referrer, screenResolution, language } = parsedBody.data;

    // Get IP address
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    
    if (ip && ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    ip = sanitizeIp(ip);
    
    if (!ip || ip === '::1') {
        ip = '127.0.0.1';
    }

    const userAgent = normalizeString(req.headers.get('user-agent') || 'Unknown', 512) || 'Unknown';
    
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
            const locRes = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`);
            const locData = await locRes.json();
            if (locData.status === 'success') {
                location = {
                    city: sanitizeTextForStorage(locData.city, 120),
                    country: sanitizeTextForStorage(locData.country, 120),
                    region: sanitizeTextForStorage(locData.regionName, 120)
                };
                isp = sanitizeTextForStorage(locData.isp, 200);
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
      timeSpent: 0,
      isBot: isBot(userAgent) || !deviceType,
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
        const parsedBody = updateVisitDurationSchema.safeParse(await req.json());
        if (!parsedBody.success) {
             return NextResponse.json({ error: 'Validation failed', details: parsedBody.error.format() }, { status: 400 });
        }

        const { id, timeSpent } = parsedBody.data;

        await Visitor.findByIdAndUpdate(id, {
            $inc: { timeSpent: Math.trunc(timeSpent) } // Increment existing time
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating visit duration:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
