import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';
import {
    escapeRegex,
    isValidObjectId,
    sanitizeSearchTerm,
    toSafeInt,
} from '@/lib/inputSecurity';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = toSafeInt(searchParams.get('page'), 1, 1, 10000);
    const limit = toSafeInt(searchParams.get('limit'), 50, 1, 200);
    const skip = (page - 1) * limit;

    const search = sanitizeSearchTerm(searchParams.get('search') || '', 100);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const excludeBots = searchParams.get('excludeBots') === 'true';

    // Build Match Query
    const matchQuery: any = {};

    if (excludeBots) {
        matchQuery.isBot = { $ne: true };
    }

    if (startDate || endDate) {
        matchQuery.visitedAt = {};
        if (startDate) {
            const parsedStartDate = new Date(startDate);
            if (Number.isNaN(parsedStartDate.getTime())) {
                return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 });
            }
            matchQuery.visitedAt.$gte = parsedStartDate;
        }
        if (endDate) {
            const parsedEndDate = new Date(endDate);
            if (Number.isNaN(parsedEndDate.getTime())) {
                return NextResponse.json({ error: 'Invalid endDate format' }, { status: 400 });
            }
            matchQuery.visitedAt.$lte = parsedEndDate;
        }
    }

    if (search) {
        const searchRegex = new RegExp(escapeRegex(search), 'i');
        matchQuery.$or = [
            { ip: searchRegex },
            { path: searchRegex },
            { 'location.city': searchRegex },
            { 'location.country': searchRegex },
            { 'browser.name': searchRegex },
            { 'os.name': searchRegex }
        ];
    }

    // Execute Main Query
    const visitors = await Visitor.find(matchQuery)
      .sort({ visitedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalvistors = await Visitor.countDocuments(matchQuery);

    // Calculate Stats (Aggregation)
    // 1. One Day Visits (respecting filters)
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const oneDayVisits = await Visitor.countDocuments({ ...matchQuery, visitedAt: { $gte: oneDayAgo } });

    // 2. Top Country
    const topCountryResult = await Visitor.aggregate([
        { $match: { ...matchQuery, "location.country": { $exists: true, $ne: null } } },
        { $group: { _id: "$location.country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const topCountry = topCountryResult.length > 0 ? topCountryResult[0]._id : "N/A";

    // 3. Top Page
    const topPageResult = await Visitor.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const topPage = topPageResult.length > 0 ? topPageResult[0]._id : "N/A";

    // 4. Chart Data Aggregation (Only if not just paginating plain list)
    // Traffic over last 7 days (or selected range)
    const trafficData = await Visitor.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" } },
                count: { $sum: 1 },
                uniqueIPs: { $addToSet: "$ip" }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", count: 1, unique: { $size: "$uniqueIPs" }, _id: 0 } }
    ]);

    // Device Type Distribution
    const deviceData = await Visitor.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$deviceType", count: { $sum: 1 } } },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);
    
    // Browser Distribution
    const browserData = await Visitor.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$browser.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);

     // OS Distribution
     const osData = await Visitor.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$os.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { name: "$_id", value: "$count", _id: 0 } }
    ]);


    return NextResponse.json({
        visitors,
        stats: {
            total: totalvistors,
            today: oneDayVisits,
            topCountry,
            topPage
        },
        charts: {
            traffic: trafficData,
            device: deviceData,
            browser: browserData,
            os: osData
        },
        pagination: {
            total: totalvistors,
            page,
            limit,
            pages: Math.ceil(totalvistors / limit)
        }
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const all = searchParams.get('all');

        if (all === 'true') {
            await Visitor.deleteMany({});
            return NextResponse.json({ success: true, message: 'All logs cleared' });
        }

        if (id) {
            if (!isValidObjectId(id)) {
                return NextResponse.json({ error: 'Invalid visitor id' }, { status: 400 });
            }
            await Visitor.findByIdAndDelete(id);
            return NextResponse.json({ success: true, message: 'Visitor deleted' });
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (error) {
        console.error('Error deleting visitor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
