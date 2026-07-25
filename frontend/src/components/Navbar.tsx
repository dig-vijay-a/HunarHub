"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

export default function Navbar() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useUI();

  useEffect(() => {
    const data = localStorage.getItem('userInfo');
    if (data) {
      setUserInfo(JSON.parse(data));
    } else {
      setUserInfo(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    showAlert('Success', 'You have been logged out.');
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  
  return (
    <nav className={`sticky top-0 w-full z-40 transition-all ${isAuthPage ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white shadow-sm border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">✨</span>
          <Link href={userInfo ? (userInfo.role === 'admin' ? '/admin' : userInfo.role === 'entrepreneur' ? '/dashboard' : '/marketplace') : '/'} className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
            HunarHub
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          {!userInfo ? (
            <>
              {pathname !== '/login' && <Link href="/login" className="font-bold text-gray-600 hover:text-emerald-600 transition">Log In</Link>}
              {pathname !== '/register' && <Link href="/register" className="font-bold text-gray-600 hover:text-emerald-600 transition">Sign Up</Link>}
            </>
          ) : (
            <>
              {userInfo.role === 'admin' && pathname !== '/admin' && (
                <Link href="/admin" className="font-bold text-gray-600 hover:text-emerald-600 transition">Admin Dashboard</Link>
              )}
              {userInfo.role === 'entrepreneur' && pathname !== '/dashboard' && (
                <Link href="/dashboard" className="font-bold text-gray-600 hover:text-emerald-600 transition">Dashboard</Link>
              )}
              {userInfo.role === 'customer' && (
                <>
                  {pathname !== '/marketplace' && <Link href="/marketplace" className="font-bold text-gray-600 hover:text-emerald-600 transition">Marketplace</Link>}
                  {pathname !== '/orders' && <Link href="/orders" className="font-bold text-gray-600 hover:text-emerald-600 transition">My Orders</Link>}
                </>
              )}
              {userInfo.role !== 'admin' && pathname !== '/messages' && (
                <Link href="/messages" className="font-bold text-gray-600 hover:text-emerald-600 transition flex items-center gap-1">
                  💬 Messages
                </Link>
              )}
              <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition shadow-sm">
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
