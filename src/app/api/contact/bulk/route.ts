import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { z } from 'zod';
import { sanitizeObjectIdArray } from '@/lib/inputSecurity';

const bulkContactSchema = z.object({
    action: z.enum(['delete', 'updateStatus']),
    ids: z.array(z.string()).min(1).max(500),
    status: z.enum(['New', 'Read', 'Replied']).optional(),
}).superRefine((value, ctx) => {
    if (value.action === 'updateStatus' && !value.status) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['status'],
            message: 'Status required for updateStatus action',
        });
    }
});

export async function POST(request: Request) {
    try {
        await connectDB();
                const parsedBody = bulkContactSchema.safeParse(await request.json());

                if (!parsedBody.success) {
                        return NextResponse.json({ message: 'Validation failed', errors: parsedBody.error.format() }, { status: 400 });
                }

                const { action, status } = parsedBody.data;
                const ids = sanitizeObjectIdArray(parsedBody.data.ids);

                if (ids.length === 0) {
                        return NextResponse.json({ message: 'No valid IDs provided' }, { status: 400 });
        }

        if (action === 'delete') {
            await Contact.deleteMany({ _id: { $in: ids } });
            return NextResponse.json({ message: 'Messages deleted successfully' });
        }

        if (action === 'updateStatus') {
            await Contact.updateMany({ _id: { $in: ids } }, { status });
            return NextResponse.json({ message: 'Messages updated successfully' });
        }

        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error in bulk operation:', error);
        return NextResponse.json({ message: 'Bulk operation failed' }, { status: 500 });
    }
}
