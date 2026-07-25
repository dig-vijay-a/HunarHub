"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Redirect if logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.role === 'admin') router.push('/admin');
      else if (parsed.role === 'entrepreneur') router.push('/dashboard');
      else router.push('/marketplace');
      return; // Stop execution if redirecting
    }

    // 2. Fetch real categories dynamically for the landing page
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [router]);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100 rounded-full blur-[100px] opacity-60"></div>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Empower Local <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Micro-Entrepreneurs</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover and support skilled artisans, tailors, potters, and more in your community. Book services and buy handmade products directly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/marketplace" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-emerald-500 hover:to-teal-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Explore Marketplace
            </Link>
            <Link href="/register" className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg transform hover:-translate-y-1">
              Join as a Seller
            </Link>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-bold mb-4 uppercase tracking-wider text-sm">Discover Services Across Categories</h3>
            {loading ? (
              <p className="text-gray-400">Loading categories...</p>
            ) : categories.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-3">
                {categories.slice(0, 10).map((cat) => (
                  <span key={cat._id} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-100">
                    {cat.name}
                  </span>
                ))}
                {categories.length > 10 && (
                  <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-full font-semibold border border-gray-200">
                    +{categories.length - 10} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No categories found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
