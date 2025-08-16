'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const auth = getAuth(app);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get the Admin UID from the environment variables for a cleaner implementation
  const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-brand-cream/95 backdrop-blur-sm shadow-sm w-full p-4 sticky top-0 z-50 border-b border-brand-pink-soft/30">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" onClick={closeMenu} className="font-title text-2xl md:text-3xl font-semibold text-brand-taupe hover:text-brand-taupe-dark transition-colors tracking-wider">
          YVD NAILS
        </Link>

        {/* Desktop Navigation Links - Using your preferred UI */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#services" className="font-body text-brand-taupe-light hover:text-brand-taupe transition-colors font-medium">
            Design Tiers
          </Link>
          <Link href="/#gelx" className="font-body text-brand-taupe-light hover:text-brand-taupe transition-colors font-medium">
            GELX Extensions
          </Link>
          <Link href="/#reviews" className="font-body text-brand-taupe-light hover:text-brand-taupe transition-colors font-medium">
            Reviews
          </Link>
          <Link href="/#gallery" className="font-body text-brand-taupe-light hover:text-brand-taupe transition-colors font-medium">
            Portfolio
          </Link>
          
          {user ? (
            <>
              {/* This is the new, cleaner admin link logic */}
              {user.uid === ADMIN_UID && (
                <Link href="/admin" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-gray-600 hover:text-pink-500 transition-colors">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-pink-500 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-pink-500 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-gray-600 hover:text-pink-500 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-pink-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </nav>

      {/* Mobile Menu - Using your preferred UI that pushes content down */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col items-center space-y-4">
          <Link href="/#services" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Design Tiers</Link>
          <Link href="/#gelx" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">GELX Extensions</Link>
          <Link href="/#reviews" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Reviews</Link>
          <Link href="/#gallery" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Portfolio</Link>
          <hr className="w-full border-t border-gray-200" />
          {user ? (
            <>
              {user.uid === ADMIN_UID && (
                 <Link href="/admin" onClick={closeMenu} className="font-semibold text-blue-600 hover:text-blue-800">Admin</Link>
              )}
              <Link href="/profile" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Profile</Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-pink-500">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Login</Link>
              <Link href="/signup" onClick={closeMenu} className="text-gray-600 hover:text-pink-500">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}