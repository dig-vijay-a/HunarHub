"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const { showAlert } = useUI();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.role === 'admin') router.push('/admin');
        else if (data.role === 'entrepreneur') router.push('/dashboard');
        else router.push('/marketplace');
      } else {
        showAlert('Login Failed', data.message);
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-white flex items-center justify-center"></div>;

  return (
    <div className="flex-1 flex flex-col lg:flex-row font-sans relative overflow-hidden bg-white">
      
      {/* Form Side (Left) */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-14 xl:px-24 py-12 relative z-10 animate-fadeIn">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Log in to your HunarHub account to continue.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
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
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:-translate-y-0 flex justify-center items-center gap-2 text-lg mt-4"
            >
              {loading ? 'Logging in...' : 'Log In ➔'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500 font-medium mt-8">
            Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </main>

      {/* Graphic Side (Right) */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative items-center justify-center p-12">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[80px]"></div>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-3xl shadow-2xl max-w-lg text-white z-10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-shadow duration-500">
          <h3 className="text-2xl font-extrabold mb-4">"HunarHub transformed my small business."</h3>
          <p className="text-blue-50 leading-relaxed text-lg font-medium mb-8">
            "Before joining, I struggled to find local customers for my tailoring services. Now, I have a steady stream of orders and a community that supports me."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-inner text-gray-900">
              🧵
            </div>
            <div>
              <p className="font-bold">Sunita Sharma</p>
              <p className="text-sm text-blue-200 uppercase tracking-wide font-semibold">Local Tailor</p>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}
