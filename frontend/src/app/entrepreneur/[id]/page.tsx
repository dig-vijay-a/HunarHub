"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function EntrepreneurProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { showAlert } = useUI();
  
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchData = async () => {
    try {
      const [profRes, revRes] = await Promise.all([
        fetch(`http://localhost:5000/api/entrepreneurs/${id}`),
        fetch(`http://localhost:5000/api/reviews/entrepreneur/${id}`)
      ]);
      if (profRes.ok) {
        const data = await profRes.json();
        setProfile({
          ...data.profile,
          products: data.products,
          services: data.services
        });
      }
      if (revRes.ok) setReviews(await revRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const placeOrder = async (productId: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) return router.push('/login');
    try {
      await fetch('http://localhost:5000/api/orders/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      showAlert('Success', 'Order placed successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const requestService = async (serviceId: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) return router.push('/login');
    try {
      await fetch('http://localhost:5000/api/orders/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ serviceId, details: 'I need this service ASAP.' })
      });
      showAlert('Success', 'Service requested successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) return router.push('/login');
    try {
      const res = await fetch(`http://localhost:5000/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ entrepreneurId: profile._id, rating, comment })
      });
      if (res.ok) {
        showAlert('Success', 'Review submitted!');
        setComment('');
        fetchData();
      } else {
        const data = await res.json();
        showAlert('Error', data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xl font-bold bg-gray-50"><span className="animate-spin text-4xl mr-3">⏳</span> Loading Profile...</div>;
  if (!profile) return <div className="flex-1 flex items-center justify-center text-xl font-bold text-red-500 bg-gray-50">Profile not found</div>;

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      <main className="max-w-5xl mx-auto p-6 mt-8 space-y-8 animate-fadeIn">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32 relative">
            {!profile.isAvailable && (
              <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg border border-red-400 backdrop-blur-sm bg-opacity-90">
                Currently Unavailable
              </div>
            )}
          </div>
          <div className="px-8 flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg border border-gray-100 relative overflow-hidden flex items-center justify-center text-4xl bg-gray-50">
              {profile.imageUrl ? <img src={profile.imageUrl} className="w-full h-full object-cover rounded-full" /> : <span>👤</span>}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Verified Artisan
            </span>
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-extrabold text-gray-900">{profile.user?.name}</h1>
              <Link href={`/messages?userId=${profile.user?._id}&name=${encodeURIComponent(profile.user?.name || '')}`} className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2">
                <span>💬</span> Message Artisan
              </Link>
            </div>
            <div className="flex gap-4 mt-2 mb-4">
              <p className="text-emerald-600 font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {profile.category}
              </p>
              {profile.location && (
                <p className="text-gray-500 font-medium text-lg">📍 {profile.location}</p>
              )}
            </div>
            
            <p className="text-gray-600 leading-relaxed mt-4 text-lg">{profile.bio}</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.skills?.map((skill: string, idx: number) => (
                <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>🛠️</span> Offered Services</h2>
            {profile.services?.length > 0 ? (
              <div className="space-y-4">
                {profile.services.map((svc: any) => (
                  <div key={svc._id} className="border border-gray-100 p-0 rounded-2xl hover:shadow-md transition bg-gray-50 flex flex-col justify-between overflow-hidden">
                    {svc.imageUrl && <div className="h-40 w-full overflow-hidden"><img src={svc.imageUrl} className="w-full h-full object-cover" /></div>}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-900">{svc.name}</h3>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm">${svc.basePrice}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 flex-1">{svc.description}</p>
                      <p className="text-gray-500 text-xs mt-4 font-medium">Duration: {svc.duration || 'N/A'}</p>
                      {profile.isAvailable ? (
                        <button onClick={() => requestService(svc._id)} className="w-full mt-4 bg-emerald-600 text-white font-bold py-2 rounded-xl hover:bg-emerald-700 transition">Request Service</button>
                      ) : (
                        <button disabled className="w-full mt-4 bg-gray-300 text-gray-500 font-bold py-2 rounded-xl cursor-not-allowed">Unavailable</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No services listed yet.</p>}
          </section>

          {/* Products */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>🛍️</span> Handmade Products</h2>
            {profile.products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.products.map((prod: any) => (
                  <div key={prod._id} className="border border-gray-100 p-0 rounded-2xl hover:shadow-md transition bg-gray-50 flex flex-col justify-between overflow-hidden">
                    {prod.imageUrl && <div className="h-40 w-full overflow-hidden"><img src={prod.imageUrl} className="w-full h-full object-cover" /></div>}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 truncate">{prod.name}</h3>
                      <span className="text-emerald-600 font-bold text-xl block mt-1">${prod.price}</span>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-1">{prod.description}</p>
                      <button onClick={() => placeOrder(prod._id)} className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">Buy Now</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500">No products listed yet.</p>}
          </section>
        </div>

        {/* Ratings and Reviews */}
        <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>⭐</span> Ratings & Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {reviews.length > 0 ? (
                reviews.map(rev => (
                  <div key={rev._id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">{rev.customer?.name}</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">⭐ {rev.rating}/5</span>
                    </div>
                    <p className="text-gray-700 text-sm italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>}
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Leave a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                  <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900">
                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                  <textarea required value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write your experience..." className="w-full p-3 bg-white border border-gray-300 rounded-xl min-h-[100px] focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Submit Review</button>
              </form>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
