import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { action, ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'No IDs provided' }, { status: 400 });
        }

        if (action === 'delete') {
            await Contact.deleteMany({ _id: { $in: ids } });
            return NextResponse.json({ message: 'Messages deleted successfully' });
        }

        if (action === 'updateStatus') {
            if (!status) return NextResponse.json({ message: 'Status required' }, { status: 400 });
            await Contact.updateMany({ _id: { $in: ids } }, { status });
            return NextResponse.json({ message: 'Messages updated successfully' });
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error in bulk operation:', error);
        return NextResponse.json({ message: 'Bulk operation failed' }, { status: 500 });
    }
}
