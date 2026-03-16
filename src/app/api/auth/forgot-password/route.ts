import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';
import { sanitizeEmail } from '@/lib/inputSecurity';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').transform((value) => sanitizeEmail(value)),
}).strict();

export async function POST(request: NextRequest) {
  try {
    const parsedBody = forgotPasswordSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsedBody.error.format() },
        { status: 400 }
      );
    }

    const { email } = parsedBody.data;

    const normalizedEmail = email.toLowerCase();
    await connectDB();

    // Check if this is the hardcoded admin email
    const isHardcodedAdmin = process.env.ADMIN_EMAIL && 
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase();

    // Find user by email
    let user = await User.findOne({ email: normalizedEmail });

    // If this is the hardcoded admin but no DB entry exists, create one
    if (!user && isHardcodedAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      user = new User({
        email: normalizedEmail,
        password: hashedPassword,
        role: 'admin',
      });
      await user.save();
    }

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
