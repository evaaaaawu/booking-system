import prisma from '@repo/prisma/lib/prisma';
import type { User as PrismaUser, EventType as PrismaEventType } from '@prisma/client';

export interface UserProps {
  user: PrismaUser & { eventTypes: PrismaEventType[] };
}

export interface UserWithEventTypeProps extends UserProps {
  eventType: PrismaEventType;
}

export async function getUser(username: string): Promise<UserProps> {
  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      username: true,
      name: true,
      bio: true,
      avatar: true,
      eventTypes: {
        select: {
          id: true,
          title: true,
          description: true,
          length: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  
  return { user: user as PrismaUser & { eventTypes: PrismaEventType[] } };
}

export async function getUserWithEventType(username: string, typeId: string): Promise<UserWithEventTypeProps> {
  const userData = await getUser(username);

  const eventType = userData.user.eventTypes.find(et => et.id === parseInt(typeId));

  if (!eventType) {
    throw new Error('Event Type not found');
  }

  return { user: userData.user, eventType };
} 
