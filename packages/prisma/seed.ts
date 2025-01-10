// TODO: 待刪除
import prisma from './lib/prisma';

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'evaaaaawu',
      name: 'Eva Wu',
      email: 'yiju.wu1@gmail.com',
      bio: 'Web Developer based in Taiwan',
      avatar: '/avatar/evaaaaawu.png',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'mayyyyy',
      name: 'May Lee',
      email: 'may@example.com',
      bio: 'Product Manager based in London',
      avatar: '/avatar/default-avatar.svg',
    },
  });

  const eventType1 = await prisma.eventType.create({
    data: {
      title: '30 Minute Consultation',
      description: 'A brief 30-minute meeting to discuss your needs.',
      length: 30,
      user: {
        connect: { id: user1.id },
      },
    },
  });

  const eventType2 = await prisma.eventType.create({
    data: {
      title: '1 Hour Strategy Session',
      description: 'An in-depth 1-hour session to strategize.',
      length: 60,
      user: {
        connect: { id: user2.id },
      },
    },
  });

  console.log('seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
