"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from '@repo/ui/spinner';

export default function SignOutPage(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div className="text-center h-screen">
      <Spinner />
      <p>Signing out...</p>
    </div>
  );
}
