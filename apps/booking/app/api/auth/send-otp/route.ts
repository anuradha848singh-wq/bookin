import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import {
  stashOTP,
  getOtpSendRate,
  incrementOtpSendRate,
  checkIpRateLimit,
} from '@book-in/lib';
import { sendOtpViaMSG91 } from '@book-in/lib';

// Helper to hash OTP
function hashOtp(otp: string): string {
  return createHash('sha256').update(otp).digest('hex');
}

// POST /api/auth/send-otp - Send OTP to phone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // IP Rate Limit check (strict limit of 5 requests per IP per minute in production)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const ipRl = await checkIpRateLimit(ip, "otp-send", 5, 60);
    if (!ipRl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again after 1 minute.' },
        { status: 429 }
      );
    }

    // Rate limit: max 3 OTP requests per phone per 10 minutes
    const currentRate = await getOtpSendRate(phone);
    if (currentRate >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again after 10 minutes.' },
        { status: 429 }
      );
    }

    await incrementOtpSendRate(phone);

    // Generate 6-digit OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = hashOtp(otpValue);

    // Store hashed OTP in Redis (10 minute TTL)
    const stored = await stashOTP(phone, hashedOtp);
    if (!stored) {
      return NextResponse.json(
        { success: false, error: 'Could not send OTP. Please try again.' },
        { status: 503 }
      );
    }

    // Send OTP via MSG91 (awaited to ensure delivery in serverless environment)
    await sendOtpViaMSG91({ phone, otp: otpValue });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
