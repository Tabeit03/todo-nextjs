// components/Navbar.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-[#7b7b12b6] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-200">
          Todo App
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-green-500 px-4 py-2 rounded hover:bg-blue-400 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}