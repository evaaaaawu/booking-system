import Head from 'next/head';
import Shell from '../components/Shell';
import SignIn from '../components/SignIn';
import { auth } from '../lib/auth';

interface SignInPromptProps {
  error: string | null;
}

const Dashboard = () => (
  <Shell heading="Dashboard">
    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
      </div>
    </div>
  </Shell>
);

const SignInPrompt: React.FC<SignInPromptProps> = ({ error }) => {
  return (
    <main className="text-center">
      <h1 className="text-2xl font-semibold">Welcome to Schedule System!</h1>
      <>
        Not signed in <br />
        <SignIn />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </>
    </main>
  );
};

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <Head>
        <title>Schedule System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? <Dashboard /> : <SignInPrompt error={null} />}
    </div>
  );
}
