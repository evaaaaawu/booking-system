import Head from 'next/head';
import { notFound } from 'next/navigation';
import { getUserWithEventType } from '../../../lib/dataFetcher';
import TypeClient from '../../../components/TypeClient';

interface PageProps {
  params: {
    username: string;
    typeId: string;
  };
}

export default async function TypePage({ params }: PageProps): Promise<JSX.Element> {
  try {
    const { user, eventType } = await getUserWithEventType(params.username, params.typeId);

    return (
      <div>
        <Head>
          <title>{eventType.title} | {user.name} | Schedule System</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="mx-auto my-24 transition-max-width ease-in-out duration-500 max-w-3xl">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="sm:flex px-4 py-5 sm:p-6">
              <TypeClient user={user} eventType={eventType} />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
