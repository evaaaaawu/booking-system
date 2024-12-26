import prisma from '@repo/prisma/lib/prisma';
import type { User as PrismaUser, EventType as PrismaEventType } from '@prisma/client';

interface Params {
  params: {
    user: string;
    type: string;
  };
}

export interface Props {
  user: Partial<PrismaUser>;
  eventType: Partial<PrismaEventType>;
}

export async function getData(params: Params): Promise<Props> {
  const { user: username, type } = params.params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      bio: true,
      avatar: true,
      eventTypes: true,
    },
  });

  const eventType = await prisma.eventType.findUnique({
    where: {
      id: parseInt(type),
    },
    select: {
      id: true,
      title: true,
      description: true,
      length: true,
    },
  });

  if (!user || !eventType) {
    throw new Error('User or Event Type not found');
  }

  return { user, eventType };
}
