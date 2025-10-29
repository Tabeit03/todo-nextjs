// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
        <Link 
          href="/" 
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}


// 'use client';

// import { useRouter } from 'next/navigation';

// export default function NotFound() {
//   const router = useRouter();
  
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
//         <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
//         <p className="text-xl text-gray-600 mb-6">Page Not Found</p>
//         <button
//           onClick={() => router.push('/')}
//           className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//         >
//           Go Home
//         </button>
//       </div>
//     </div>
//   );
// }