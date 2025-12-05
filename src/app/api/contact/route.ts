import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ message: 'Error fetching contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { firstName, lastName, email, mobileNumber, subject, message } = body;

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
