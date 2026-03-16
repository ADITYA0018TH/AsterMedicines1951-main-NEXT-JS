import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { z } from 'zod';
import {
  escapeRegex,
  isValidObjectId,
  sanitizeEmail,
  sanitizeSearchTerm,
  sanitizeTextForStorage,
  toSafeInt,
} from '@/lib/inputSecurity';

const contactCreateSchema = z.object({
  firstName: z.string().min(1, 'First Name is required').max(100).transform((value) => sanitizeTextForStorage(value, 100)),
  lastName: z.string().max(100).optional().transform((value) => {
    const sanitized = sanitizeTextForStorage(value, 100);
    return sanitized || undefined;
  }),
  email: z.string().email('Invalid email address').transform((value) => sanitizeEmail(value)),
  mobileNumber: z.string().regex(/^\d+$/, 'Mobile number must contain only digits').min(10, 'Mobile number must be at least 10 digits').max(15),
  subject: z.string().max(200).optional().transform((value) => {
    const sanitized = sanitizeTextForStorage(value, 200);
    return sanitized || undefined;
  }),
  message: z.string().min(1, 'Message is required').max(5000).transform((value) => sanitizeTextForStorage(value, 5000)),
});

const contactPatchSchema = z.object({
  id: z.string().refine((value) => isValidObjectId(value), 'Invalid contact id'),
  status: z.enum(['New', 'Read', 'Replied']),
});

const allowedStatuses = new Set(['New', 'Read', 'Replied']);

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = toSafeInt(searchParams.get('page'), 1, 1, 10000);
    const limit = toSafeInt(searchParams.get('limit'), 10, 1, 100);
    const search = sanitizeSearchTerm(searchParams.get('search') || '', 100);
    const status = sanitizeSearchTerm(searchParams.get('status') || 'All', 20);

    if (status !== 'All' && !allowedStatuses.has(status)) {
      return NextResponse.json({ message: 'Invalid status filter' }, { status: 400 });
    }

    const query: Record<string, unknown> = {};

    if (search) {
      const safeSearchRegex = new RegExp(escapeRegex(search), 'i');
      query.$or = [
        { firstName: safeSearchRegex },
        { lastName: safeSearchRegex },
        { email: safeSearchRegex },
        { subject: safeSearchRegex },
      ];
    }

    if (status !== 'All') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(query)
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Error fetching contacts' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const parsedBody = contactPatchSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json({ message: 'Validation failed', errors: parsedBody.error.format() }, { status: 400 });
    }

    const { id, status } = parsedBody.data;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated', contact: updatedContact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json({ message: 'Error updating status' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Connection check
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ message: 'Database Service Unavailable' }, { status: 503 });
    }

    // 2. Validation
    const validationResult = contactCreateSchema.safeParse(await request.json());
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, mobileNumber, subject, message } = validationResult.data;

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      subject,
      message
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      contact: newContact
    }, { status: 201 });

  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
  }
}
