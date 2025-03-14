import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main application page
    router.push('/calendar-app');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Loading Healthcare App...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to the application.</p>
      </div>
    </div>
  );
}
