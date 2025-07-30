'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 1. Import the useAuth hook and Firebase services
import { useAuth } from '@/lib/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function Header() {
  // 2. Use the hook to get the current user and loading state
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="bg-white shadow-md w-full p-4 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-500">
          YVD NAILS
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/#services" className="text-gray-600 hover:text-pink-500 transition-colors">
            Services
          </Link>
          <Link href="/#gallery" className="text-gray-600 hover:text-pink-500 transition-colors">
            Gallery
          </Link>

          {/* 3. Conditionally render links based on user state */}
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              // If user is logged in, show Profile and Logout
              <>
                <Link href="/profile" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // If user is logged out, show Login and Sign Up
              <>
                <Link href="/login" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="md:hidden">
            <button className="text-gray-600 hover:text-pink-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </nav>
    </header>
  );
}
