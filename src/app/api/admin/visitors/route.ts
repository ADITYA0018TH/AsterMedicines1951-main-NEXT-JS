import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Visitor from '@/models/Visitor';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const visitors = await Visitor.find({})
      .sort({ visitedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalvistors = await Visitor.countDocuments({});

    // Calculate Stats
    // 1. One Day Visits
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const oneDayVisits = await Visitor.countDocuments({ visitedAt: { $gte: oneDayAgo } });

    // 2. Top Country
    const topCountryResult = await Visitor.aggregate([
        { $match: { "location.country": { $exists: true, $ne: null } } },
        { $group: { _id: "$location.country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const topCountry = topCountryResult.length > 0 ? topCountryResult[0]._id : "N/A";

    // 3. Top Page
    const topPageResult = await Visitor.aggregate([
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    const topPage = topPageResult.length > 0 ? topPageResult[0]._id : "N/A";

    return NextResponse.json({
        visitors,
        stats: {
            total: totalvistors,
            today: oneDayVisits,
            topCountry,
            topPage
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
