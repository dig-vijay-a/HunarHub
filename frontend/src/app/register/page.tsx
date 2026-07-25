"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' or 'entrepreneur'
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useUI();
  const [stats, setStats] = useState({ entrepreneurCount: 0, satisfactionPercentage: 100 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        if (data.role === 'admin') router.push('/admin');
        else if (data.role === 'entrepreneur') router.push('/dashboard');
        else router.push('/marketplace');
      } catch (err) {
        setIsCheckingAuth(false);
      }
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (role === 'entrepreneur') router.push('/dashboard');
        else router.push('/marketplace');
      } else {
        showAlert('Registration Failed', data.message);
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-white flex items-center justify-center"></div>;

  return (
    <div className="flex-1 flex flex-col lg:flex-row font-sans relative overflow-hidden bg-white">
      
      {/* Graphic Side (Left) */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 relative items-center justify-center p-12 order-2 lg:order-1">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[80px]"></div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg text-white z-10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500">
          <h3 className="text-2xl font-extrabold mb-4">Empower Your Local Economy</h3>
          <p className="text-blue-50 leading-relaxed text-lg font-medium mb-8">
            Join thousands of customers and skilled micro-entrepreneurs building a vibrant local marketplace.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-3xl font-extrabold mb-1">
                {statsLoading ? <span className="animate-pulse bg-white/20 text-transparent rounded">000</span> : `${stats.entrepreneurCount}+`}
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-200">Local Artisans</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-3xl font-extrabold mb-1">
                {statsLoading ? <span className="animate-pulse bg-white/20 text-transparent rounded">00%</span> : `${stats.satisfactionPercentage}%`}
              </p>
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-200">Satisfaction</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Form Side (Right) */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 xl:px-24 py-12 relative z-10 animate-fadeIn order-1 lg:order-2">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Join HunarHub</h2>
            <p className="text-gray-500 font-medium">Create your account to get started.</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-900" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-900" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-gray-900 pr-12" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition text-xl"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => setRole('customer')} 
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'}`}
                >
                  Buy Services
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('entrepreneur')} 
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${role === 'entrepreneur' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'}`}
                >
                  Sell Services
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:-translate-y-0 flex justify-center items-center gap-2 text-lg"
            >
              {loading ? 'Creating Account...' : 'Sign Up ➔'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 font-medium mt-8">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </main>

    </div>
  );
}
