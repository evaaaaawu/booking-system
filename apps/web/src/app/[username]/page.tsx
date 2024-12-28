import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import { getUser } from '../../lib/dataFetcher';

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps): Promise<JSX.Element> {
  try {
    const { user } = await getUser(params.username);

    const eventTypes = user.eventTypes.map((type) =>
      <Link href={`/${user.username}/${type.id}`} key={type.id}>
        <li className="px-6 py-4">
          <div className="inline-block w-3 h-3 rounded-full bg-blue-600 mr-2">
            <h2 className="inline-block font-medium">{type.title}</h2>
            <p className="inline-block text-gray-400 ml-2">{type.description}</p>
          </div>
        </li>
      </Link>  
    );

    return (
      <div>
        <Head>
          <title>{user.name} | Schedule System</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>

        <main className="max-w-2xl mx-auto my-24">
          <div className="mb-8 text-center">
            <Image
              alt="Avatar"
              className="mx-auto rounded-full mb-4"
              height={96}
              src={user.avatar ?? "/avatar/default-avatar.svg"}
              width={96}
            />
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">{user.name}</h1>
            <p className="text-gray-600">{user.bio}</p>
          </div>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
              {eventTypes}
            </ul>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
