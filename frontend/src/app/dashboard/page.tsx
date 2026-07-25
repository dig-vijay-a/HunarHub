"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/context/UIContext';

export default function Dashboard() {
  const { showAlert } = useUI();
  const [profile, setProfile] = useState<any>(null);
  const [ordersData, setOrdersData] = useState<{orders: any[], requests: any[]}>({ orders: [], requests: [] });
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Listing Forms State
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' });
  const [newService, setNewService] = useState({ name: '', description: '', basePrice: '', duration: '', imageUrl: '' });
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ bio: '', location: '', imageUrl: '', category: '', skills: '' });

  const router = useRouter();

  const fetchData = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token || userInfo.role !== 'entrepreneur') {
      router.push('/login');
      return;
    }
    try {
      const [profileRes, ordersRes, catRes] = await Promise.all([
        fetch('http://localhost:5000/api/profile', { headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
        fetch('http://localhost:5000/api/orders/entrepreneur', { headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
        fetch('http://localhost:5000/api/categories')
      ]);
      
      if (profileRes.ok) {
        const p = await profileRes.json();
        setProfile(p);
        setEditProfileData({ bio: p.bio || '', location: p.location || '', imageUrl: p.imageUrl || '', category: p.category || '', skills: p.skills?.join(', ') || '' });
      }
      if (ordersRes.ok) setOrdersData(await ordersRes.json());
      if (catRes.ok) setCategoriesData(await catRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const toggleAvailability = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const res = await fetch(`http://localhost:5000/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ isAvailable: !profile.isAvailable })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const skillsArray = editProfileData.skills.split(',').map(s => s.trim()).filter(s => s);
      const res = await fetch(`http://localhost:5000/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ ...editProfileData, skills: skillsArray })
      });
      if (res.ok) {
        setIsEditingProfile(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id: string, status: string, type: 'order'|'request') => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const endpoint = type === 'order' ? `/api/orders/${id}/status` : `/api/orders/requests/${id}/status`;
    
    try {
      await fetch(`http://localhost:5000${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const createListing = async (e: React.FormEvent, type: 'product'|'service') => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const endpoint = type === 'product' ? '/api/marketplace/products' : '/api/marketplace/services';
    const body = type === 'product' ? newProduct : newService;

    try {
      await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify(body)
      });
      showAlert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
      if(type==='product') setNewProduct({ name: '', description: '', price: '', category: '', imageUrl: '' });
      else setNewService({ name: '', description: '', basePrice: '', duration: '', imageUrl: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      showAlert('Error', 'Failed to create listing');
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xl font-bold bg-gray-50">Loading...</div>;

  const completedOrders = ordersData.orders.filter(o => o.status === 'completed');
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="flex-1 bg-gray-50 text-gray-800 pb-20 font-sans">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pb-24 pt-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-gray-600 overflow-hidden">
              {profile?.imageUrl ? <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" /> : <span>👤</span>}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {profile?.user?.name || 'Entrepreneur'}! 👋</h1>
              <p className="text-gray-400 mt-1 text-sm font-semibold uppercase tracking-wide">Dashboard & Management</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={toggleAvailability} className={`px-5 py-2.5 font-bold rounded-xl transition shadow-sm border ${profile.isAvailable ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600' : 'bg-red-500 text-white hover:bg-red-600 border-red-600'}`}>
              {profile.isAvailable ? '🟢 Available for Hire' : '🔴 Currently Busy'}
            </button>
            <button onClick={() => { setIsEditingProfile(true); setActiveTab('overview'); }} className="px-5 py-2.5 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition shadow-sm border border-gray-600">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-12 relative z-10 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex gap-2 overflow-x-auto">
          {['overview', 'listings', 'orders'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold transition-all rounded-xl whitespace-nowrap border-b-2 ${activeTab === tab ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {isEditingProfile ? (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                      <select required className="w-full p-3 bg-gray-50 border rounded-xl text-gray-900" value={editProfileData.category} onChange={e=>setEditProfileData({...editProfileData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {categoriesData.map((cat:any) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Location (City)</label>
                      <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl text-gray-900" value={editProfileData.location} onChange={e=>setEditProfileData({...editProfileData, location: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                    <textarea className="w-full p-3 bg-gray-50 border rounded-xl text-gray-900" value={editProfileData.bio} onChange={e=>setEditProfileData({...editProfileData, bio: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl text-gray-900" value={editProfileData.skills} onChange={e=>setEditProfileData({...editProfileData, skills: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Avatar Image URL</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl text-gray-900" value={editProfileData.imageUrl} onChange={e=>setEditProfileData({...editProfileData, imageUrl: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">Save Changes</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Stat Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                      💰
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Total Earnings</p>
                      <p className="text-3xl font-extrabold text-gray-900">${totalEarnings}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                      📦
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Completed Orders</p>
                      <p className="text-3xl font-extrabold text-gray-900">{completedOrders.length}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                      📍
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Location Area</p>
                      <p className="text-xl font-extrabold text-gray-900 mt-1">{profile?.location || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 p-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2"><span>📝</span> About Me</h3>
                      <p className="text-gray-600 leading-relaxed">{profile?.bio || 'Add a bio.'}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                      <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2"><span>🛠️</span> Skills</h3>
                      {profile?.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill: string, idx: number) => (
                            <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold">{skill}</span>
                          ))}
                        </div>
                      ) : <p className="text-gray-500 text-sm">No skills added yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>🛍️</span> Add Product</h2>
              <form onSubmit={(e) => createListing(e, 'product')} className="space-y-4">
                <input type="text" placeholder="Product Name" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
                <textarea placeholder="Description" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[100px] text-gray-900" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} />
                <div className="flex gap-4">
                  <input type="number" placeholder="Price ($)" required className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} />
                  <select required className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categoriesData.map((cat:any) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <input type="url" placeholder="Image URL (optional)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newProduct.imageUrl} onChange={e=>setNewProduct({...newProduct, imageUrl: e.target.value})} />
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Create Product</button>
              </form>
            </section>
            
            <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>🛠️</span> Add Service</h2>
              <form onSubmit={(e) => createListing(e, 'service')} className="space-y-4">
                <input type="text" placeholder="Service Name" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} />
                <textarea placeholder="Description" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[100px] text-gray-900" value={newService.description} onChange={e=>setNewService({...newService, description: e.target.value})} />
                <div className="flex gap-4">
                  <input type="number" placeholder="Base Price ($)" required className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newService.basePrice} onChange={e=>setNewService({...newService, basePrice: e.target.value})} />
                  <input type="text" placeholder="Duration (e.g. 2 hours)" className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newService.duration} onChange={e=>setNewService({...newService, duration: e.target.value})} />
                </div>
                <input type="url" placeholder="Image URL (optional)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900" value={newService.imageUrl} onChange={e=>setNewService({...newService, imageUrl: e.target.value})} />
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Create Service</button>
              </form>
            </section>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>📥</span> Service Requests</h2>
              {ordersData.requests.length > 0 ? (
                <div className="space-y-4">
                  {ordersData.requests.map((req) => (
                    <div key={req._id} className="border border-gray-100 p-5 rounded-2xl hover:shadow-md transition bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{req.service?.name}</h3>
                        <span className="bg-white border text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{req.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">From: {req.customer?.name}</p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-inner">"{req.details}"</p>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => updateOrderStatus(req._id, 'accepted', 'request')} className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl hover:bg-emerald-700 transition">Accept</button>
                          <button onClick={() => updateOrderStatus(req._id, 'rejected', 'request')} className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded-xl hover:bg-red-200 transition">Reject</button>
                        </div>
                      )}
                      {req.status === 'accepted' && (
                        <button onClick={() => updateOrderStatus(req._id, 'completed', 'request')} className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">Mark Completed</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500">No service requests.</p>}
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span>📦</span> Product Orders</h2>
              {ordersData.orders.length > 0 ? (
                <div className="space-y-4">
                  {ordersData.orders.map((order) => (
                    <div key={order._id} className="border border-gray-100 p-5 rounded-2xl hover:shadow-md transition bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{order.product?.name}</h3>
                        <span className="bg-white border text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Buyer: {order.customer?.name}</p>
                      <p className="text-sm text-gray-800 bg-white p-3 rounded-xl border border-gray-200 mb-4 shadow-inner">Qty: {order.quantity} <span className="mx-2">|</span> Total: <span className="text-emerald-600 font-bold">${order.totalPrice}</span></p>
                      {order.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(order._id, 'processing', 'order')} className="w-full mt-4 bg-emerald-600 text-white font-bold py-2 rounded-xl hover:bg-emerald-700 transition">Start Processing</button>
                      )}
                      {order.status === 'processing' && (
                        <button onClick={() => updateOrderStatus(order._id, 'completed', 'order')} className="w-full mt-4 bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">Mark Completed</button>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p className="text-gray-500">No product orders.</p>}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
