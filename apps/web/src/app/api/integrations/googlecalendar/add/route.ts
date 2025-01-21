import { NextResponse } from 'next/server';
import prisma from '@repo/prisma/lib/prisma';
import { google } from 'googleapis';
import { auth } from '../../../../../lib/auth';

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',
];

export async function GET() {
  try {
    // 檢查使用者是否已驗證
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in to do this' },
        { status: 401 }
      );
    }

    // 從資料庫獲取使用者 ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email || '',
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // 獲取 Google API 憑證
    const credentials: string | undefined = process.env.GOOGLE_API_CREDENTIALS;
    if (!credentials) {
      return NextResponse.json(
        { message: 'Google API credentials are not defined.' },
        { status: 500 }
      );
    }

    const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return NextResponse.json({ url: authUrl }, { status: 200 });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
