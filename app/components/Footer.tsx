import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} YVD NAILS. All Rights Reserved.</p>
        </div>

        {/* Updated Footer Links */}
        <div className="flex gap-6">
          <Link href="/policies" className="text-gray-400 hover:text-white transition-colors">
            Booking Policies
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
