import { NextRequest, NextResponse } from 'next/server';
import prisma from '@repo/prisma/lib/prisma';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

export async function GET(req: NextRequest, { params }: { params: { name: string } }): Promise<NextResponse> {
  const { name } = params;
  const url = new URL(req.url);
  const date = url.searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date query parameter is required.' }, { status: 400 });
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      name,
    },
    select: {
      credentials: true
    }
  });

  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const credentials = process.env.GOOGLE_API_CREDENTIALS;

  if (!credentials) {
    return NextResponse.json({ error: 'Missing Google API credentials' }, { status: 500 })
  }
  
  // Set up Google API credentials
  const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const credentialKey = currentUser.credentials[0].key;
  if (!credentialKey) {
    return NextResponse.json({ error: 'User credential key is missing.' }, { status: 500 });
  }
  oAuth2Client.setCredentials(credentialKey as Credentials);

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  try {
    const apires = await calendar.freebusy.query({
      requestBody: {
        timeMin: `${date}T00:00:00.00Z`,
        timeMax: `${date}T23:59:59.59Z`,
        items: [{ id: 'primary' }]
      }
    });
    const availability = apires.data.calendars;
    return NextResponse.json(availability);
  } catch (err) {
    console.error('The API returned an error: ', err);
    return NextResponse.json({ error: 'Failed to fetch availability.' }, { status: 500 });
  }
}
