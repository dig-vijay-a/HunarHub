"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) return null;

  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4 inline-block">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent tracking-tight">HunarHub</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Empowering local micro-entrepreneurs by connecting them directly with the community. Discover services, book artisans, and buy handmade products.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li><Link href="/marketplace" className="hover:text-blue-600 transition-colors">Marketplace</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link></li>
            <li><Link href="/register" className="hover:text-blue-600 transition-colors">Join as a Seller</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-4">Support</h3>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
            <li><Link href="/safety" className="hover:text-blue-600 transition-colors">Safety Guidelines</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
        <p>&copy; {new Date().getFullYear()} HunarHub. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/twitter" className="hover:text-blue-500 transition-colors">Twitter</Link>
          <Link href="/instagram" className="hover:text-blue-500 transition-colors">Instagram</Link>
          <Link href="/linkedin" className="hover:text-blue-500 transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}
