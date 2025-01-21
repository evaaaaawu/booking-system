import { NextResponse } from 'next/server';
import prisma from '@repo/prisma/lib/prisma';
import { auth } from '../../../lib/auth';

export async function GET() {
  const session = await auth();

  if (!session) { 
    return NextResponse.json({ message: 'You must be logged in to do this' }, { status: 401 });
  }

  const userWithCredentials = await prisma.user.findFirst({
    where: {
      email: session.user?.email ?? '',
    },
    select: {
      id: true,
      credentials: {
        select: {
          type: true,
          key: true
        }
      }
    }
  });

  if (!userWithCredentials) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(userWithCredentials.credentials, { status: 200 });
}
