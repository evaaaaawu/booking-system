"use client";

import { signIn } from "next-auth/react";

export default function SignIn(): JSX.Element {
  const handleSignIn = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleSignIn}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign in with Google
    </button>
  );
}
