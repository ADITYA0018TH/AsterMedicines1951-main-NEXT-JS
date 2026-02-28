import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().regex(/^\d+$/, "Mobile number must contain only digits").min(10, "Mobile number must be at least 10 digits"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'All';

    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
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
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ message: 'ID and status are required' }, { status: 400 });
    }

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

    const body = await request.json();

    // 2. Validation
    const validationResult = contactSchema.safeParse(body);
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
