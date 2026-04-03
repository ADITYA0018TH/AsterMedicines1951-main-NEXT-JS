import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ProductView from '@/models/ProductView';
import { z } from 'zod';
import {
    normalizeString,
    sanitizeIp,
    sanitizePath,
} from '@/lib/inputSecurity';

const trackProductViewSchema = z.object({
    productId: z.string().min(1).max(50),
    productSlug: z.string().min(1).max(200),
    productName: z.string().min(1).max(300),
    category: z.string().min(1).max(100),
    referrer: z.string().max(2048).optional(),
}).strict();

// Track a product view
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const parsedBody = trackProductViewSchema.safeParse(await req.json());
        if (!parsedBody.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsedBody.error.format() },
                { status: 400 }
            );
        }

        const { productId, productSlug, productName, category, referrer } = parsedBody.data;

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
        
        // Simple device type detection
        let deviceType = 'desktop';
        if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
            deviceType = /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
        }

        await ProductView.create({
            productId,
            productSlug: sanitizePath(productSlug),
            productName: normalizeString(productName, 300),
            category: normalizeString(category, 100),
            ip,
            userAgent,
            referrer: referrer ? sanitizePath(referrer) : undefined,
            deviceType,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking product view:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Get product analytics (admin only)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || '7d';
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

        // Calculate date range
        let startDate = new Date();
        switch (period) {
            case '24h':
                startDate.setHours(startDate.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            case 'all':
                startDate = new Date(0);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }

        // Aggregate most viewed products
        const mostViewed = await ProductView.aggregate([
            {
                $match: {
                    viewedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$productId',
                    productName: { $first: '$productName' },
                    productSlug: { $first: '$productSlug' },
                    category: { $first: '$category' },
                    views: { $sum: 1 },
                    uniqueIps: { $addToSet: '$ip' },
                    lastViewed: { $max: '$viewedAt' },
                }
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    productSlug: 1,
                    category: 1,
                    views: 1,
                    uniqueVisitors: { $size: '$uniqueIps' },
                    lastViewed: 1,
                }
            },
            { $sort: { views: -1 } },
            { $limit: limit }
        ]);

        // Get total views
        const totalViews = await ProductView.countDocuments({
            viewedAt: { $gte: startDate }
        });

        // Get views by category
        const byCategory = await ProductView.aggregate([
            {
                $match: {
                    viewedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$category',
                    views: { $sum: 1 }
                }
            },
            { $sort: { views: -1 } }
        ]);

        // Get views by device type
        const byDevice = await ProductView.aggregate([
            {
                $match: {
                    viewedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$deviceType',
                    views: { $sum: 1 }
                }
            }
        ]);

        // Get views over time (daily for last 7 days)
        const dailyViews = await ProductView.aggregate([
            {
                $match: {
                    viewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' }
                    },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                mostViewed,
                totalViews,
                byCategory,
                byDevice,
                dailyViews,
                period,
            }
        });
    } catch (error) {
        console.error('Error fetching product analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
