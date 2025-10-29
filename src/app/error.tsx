'use client';

import { useEffect } from 'react';

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
        <p className="text-gray-600 mb-6">An unexpected error occurred.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}