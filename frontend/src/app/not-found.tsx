import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col font-sans relative overflow-hidden items-center justify-center p-6 text-center">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100 rounded-full blur-[100px] opacity-60"></div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative z-10 max-w-md w-full">
        <div className="text-8xl mb-4">🛸</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 font-medium">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="inline-block w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all text-lg">
          Return Home ➔
        </Link>
      </div>
    </div>
  );
}
