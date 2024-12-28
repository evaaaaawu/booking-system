import { NextRequest, NextResponse } from 'next/server'
import prisma from '@repo/prisma/lib/prisma';
import { google } from 'googleapis'
import { Credentials } from 'google-auth-library';

export async function POST(req: NextRequest, { params }: { params: { user: string } }) {
  const { user } = params

  const currentUser = await prisma.user.findFirst({
    where: {
      username: user,
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

  const reqBody = await req.json()

  const event = {
    'summary': 'Meeting with ' + reqBody.name,
    'description': reqBody.notes,
    'start': {
      'dateTime': reqBody.start,
      'timeZone': 'Asia/Taipei',
    },
    'end': {
      'dateTime': reqBody.end,
      'timeZone': 'Asia/Taipei',
    },
    'attendees': [
      { 'email': reqBody.email },
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'email', 'minutes': 60 }
      ],
    },
  };

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
  try {
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return NextResponse.json({ message: 'Event created' }, { status: 200 })
  } catch (err) {
    console.error('Error contacting the Calendar service:', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
