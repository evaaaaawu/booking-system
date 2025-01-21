import { NextRequest, NextResponse } from 'next/server';
import prisma from '@repo/prisma/lib/prisma';
import { google } from 'googleapis';
import { auth } from '../../../../../lib/auth';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // 檢查用戶是否已驗證
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'You must be logged in to do this' }, { status: 401 });
  }

  // 取得用戶資料
  const user = await prisma.user.findFirst({
    where: { email: session.user?.email ?? '' },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const credentials = JSON.parse(process.env.GOOGLE_API_CREDENTIALS!).web;

  if (!credentials) {
    return NextResponse.json({ message: 'Google API credentials not found' }, { status: 404 });
  }

  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const { tokens } = await oAuth2Client.getToken(code!);
    await prisma.credential.create({
      data: {
        type: 'google_calendar',
        key: JSON.stringify(tokens),
        userId: user.id,
      },
    });
    return NextResponse.redirect('/integrations');
  } catch (error) {
    console.error('Error retrieving access token', error);
    return NextResponse.json({ message: 'Error retrieving access token' }, { status: 500 });
  }
}
