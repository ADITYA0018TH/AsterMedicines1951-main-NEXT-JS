import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Check against environment variables first
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && 
        email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      
      const token = jwt.sign(
        { userId: 'static_admin_id', role: 'admin' },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      return NextResponse.json({
        token,
        user: {
          id: 'static_admin_id',
          email: email,
          role: 'admin'
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
