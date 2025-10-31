'use client';

import { useAuth } from '@/contexts/AuthContext';
import TodoList from '@/components/TodoList';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d1d186]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#d1d186]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Todo App</h1>
          <p className="text-gray-600 mb-6">
            Manage your tasks efficiently with our simple and elegant todo application. <br /> Login or create an account to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8">
        <TodoList />
      </div>
    </>
  );
}