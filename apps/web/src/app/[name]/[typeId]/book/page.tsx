import Image from 'next/image';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import dayjs from 'dayjs';
import BookingForm from '../../../../components/BookingForm';
import { getUserWithEventType } from '../../../../lib/dataFetcher';

interface PageProps {
  params: {
    name: string;
    typeId: string;
  };
}

export default async function BookPage({ params }: PageProps) {
  try {
    const { user, eventType } = await getUserWithEventType(params.name, params.typeId);
    console.log(user);
    return (
      <div>
        <Head>
          <title>
            Confirm your {eventType.title} with {user.name} | Schedule System
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="max-w-3xl mx-auto my-24">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="sm:flex px-4 py-5 sm:p-6">
              <div className="sm:w-1/2 sm:border-r">
                <Image
                  src={user.image ?? ""}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mb-4"
                />
                <h2 className="font-medium text-gray-500">{user.name}</h2>
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                  {eventType.title}
                </h1>
                <p className="text-gray-500 mb-2">
                  <svg
                    className="inline-block w-4 h-4 mr-1 -mt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {eventType.length} minutes
                </p>
                <p className="text-blue-600 mb-4">
                  <svg
                    className="inline-block w-4 h-4 mr-1 -mt-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {dayjs().format('hh:mma, dddd DD MMMM YYYY')}
                </p>
                <p className="text-gray-600">{eventType.description}</p>
              </div>
              <div className="sm:w-1/2 pl-8 pr-4">
                <BookingForm user={user} eventType={eventType} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
