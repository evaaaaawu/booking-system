"use client";

import { useState } from "react";

interface ProfileDropdownProps {
  user: {
    name: string;
    email: string;
    image: string;
  } | null;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps): JSX.Element {
  console.log("ProfileDropdown user:", user);

  const [profileDropdownExpanded, setProfileDropdownExpanded] = useState(false);

  const toggleProfileDropdown = () => {
    console.log("Toggle dropdown, expanded:", !profileDropdownExpanded);
    setProfileDropdownExpanded(!profileDropdownExpanded);
  };

  if (!user) {
    console.log("No user, returning empty fragment");
    return <></>;
  }

  return (
    <div className="ml-3 relative">
      <div>
        <button
          onClick={toggleProfileDropdown}
          type="button"
          className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu"
          aria-expanded={profileDropdownExpanded}
          aria-haspopup="true"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full"
            src={user?.image || ''}
            alt=""
          />
        </button>
      </div>
      {
        profileDropdownExpanded && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
            <a href="/auth/signout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
          </div>
        )
      }
    </div>
  );
}
