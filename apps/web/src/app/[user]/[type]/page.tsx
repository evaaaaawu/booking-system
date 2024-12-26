import Head from 'next/head';
import { getData, Props } from '../../../lib/dataFetcher';
import TypeClient from '../../../components/TypeClient';

interface PageProps {
  params: {
    user: string;
    type: string;
  };
}

export default async function TypePage({ params }: PageProps): Promise<JSX.Element> {
  const data: Props = await getData({ params });

  return (
    <div>
      <Head>
        <title>{data.eventType.title} | {data.user.name} | Schedule System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto my-24 transition-max-width ease-in-out duration-500 max-w-3xl">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="sm:flex px-4 py-5 sm:p-6">
            <TypeClient user={data.user} eventType={data.eventType} />
          </div>
        </div>
      </main>
    </div>
  );
}
