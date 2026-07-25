"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [entrepreneurs, setEntrepreneurs] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showAlert, showConfirm } = useUI();

  const fetchData = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token || userInfo.role !== 'admin') {
      router.push('/login');
      return;
    }
    try {
      const [statsRes, entRes, dispRes, catRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', { headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
        fetch('http://localhost:5000/api/admin/entrepreneurs', { headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
        fetch('http://localhost:5000/api/disputes', { headers: { 'Authorization': `Bearer ${userInfo.token}` } }),
        fetch('http://localhost:5000/api/categories')
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (entRes.ok) setEntrepreneurs(await entRes.json());
      if (dispRes.ok) setDisputes(await dispRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const verifyEntrepreneur = async (id: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      await fetch(`http://localhost:5000/api/admin/entrepreneurs/${id}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      showAlert('Success', 'Entrepreneur verified successfully');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const removeEntrepreneur = async (id: string) => {
    const confirmed = await showConfirm('Remove Entrepreneur', 'Are you sure you want to completely remove this entrepreneur and their account?');
    if (!confirmed) return;
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      await fetch(`http://localhost:5000/api/admin/entrepreneurs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      showAlert('Success', 'Entrepreneur removed successfully');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const resolveDispute = async (id: string) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      await fetch(`http://localhost:5000/api/disputes/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      showAlert('Success', 'Dispute marked as resolved');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      if (res.ok) {
        setNewCategoryName('');
        fetchData();
      } else {
        const data = await res.json();
        showAlert('Error', data.message || 'Failed to create category');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id: string) => {
    const confirmed = await showConfirm('Delete Category', 'Are you sure you want to delete this category?');
    if (!confirmed) return;
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        showAlert('Error', data.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xl font-bold bg-gray-50"><span className="animate-spin text-4xl mr-3">⏳</span> Loading Admin...</div>;

  return (
    <div className="flex-1 bg-gray-50 pb-20 font-sans">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pb-24 pt-12 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-gray-600 overflow-hidden">
              <span>🛡️</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
              <p className="text-gray-400 mt-1 text-sm font-semibold uppercase tracking-wide">Platform Management & Analytics</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 space-y-8 animate-fadeIn">
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium uppercase text-sm mb-2 tracking-wider">Users</span>
            <span className="text-4xl font-extrabold text-blue-600">{stats?.totalUsers || 0}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium uppercase text-sm mb-2 tracking-wider">Entrepreneurs</span>
            <span className="text-4xl font-extrabold text-purple-600">{stats?.totalEntrepreneurs || 0}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium uppercase text-sm mb-2 tracking-wider">Orders</span>
            <span className="text-4xl font-extrabold text-emerald-600">{stats?.totalOrders || 0}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium uppercase text-sm mb-2 tracking-wider">Requests</span>
            <span className="text-4xl font-extrabold text-orange-600">{stats?.totalServiceRequests || 0}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <span className="text-gray-500 font-medium uppercase text-sm mb-2 tracking-wider">Revenue</span>
            <span className="text-4xl font-extrabold text-green-600">${stats?.totalRevenue || 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">Manage Entrepreneurs</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-5">Name</th>
                    <th className="p-5">Category</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entrepreneurs.map((ent, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-5 font-semibold text-gray-900 flex items-center gap-2">
                        {ent.user?.name}
                        {ent.isVerified && <span title="Verified" className="text-blue-500 bg-blue-50 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>}
                      </td>
                      <td className="p-5 text-gray-600 font-medium">{ent.category}</td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        {!ent.isVerified && (
                          <button onClick={() => verifyEntrepreneur(ent._id)} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">Verify</button>
                        )}
                        <button onClick={() => removeEntrepreneur(ent._id)} className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl font-bold hover:bg-red-100 transition shadow-sm">Remove</button>
                      </td>
                    </tr>
                  ))}
                  {entrepreneurs.length === 0 && (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-medium text-lg">No entrepreneurs pending verification.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">Manage Categories</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={createCategory} className="flex gap-4 mb-6">
                <input 
                  type="text" 
                  placeholder="New Category Name (e.g. Electrician)" 
                  required 
                  value={newCategoryName} 
                  onChange={e=>setNewCategoryName(e.target.value)} 
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm whitespace-nowrap">Add Category</button>
              </form>

              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <div key={cat._id} className="bg-gray-50 border border-gray-200 pl-4 pr-1 py-1 rounded-full flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                    <button onClick={() => deleteCategory(cat._id)} className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-700 transition">✕</button>
                  </div>
                ))}
                {categories.length === 0 && <p className="text-gray-500 w-full">No categories exist yet.</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">Active Disputes</h2>
            <div className="space-y-4">
              {disputes.filter(d => d.status === 'open').map((dispute, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{dispute.orderType}</span>
                    <span className="text-gray-500 text-sm">Customer: {dispute.customer?.name}</span>
                  </div>
                  <p className="text-gray-800 font-medium my-3">"{dispute.reason}"</p>
                  <div className="flex justify-between items-center mt-4 border-t pt-4">
                    <span className="text-sm text-gray-500 font-semibold">Vs. {dispute.entrepreneur?.user?.name}</span>
                    <button onClick={() => resolveDispute(dispute._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">Mark Resolved</button>
                  </div>
                </div>
              ))}
              {disputes.filter(d => d.status === 'open').length === 0 && (
                <div className="bg-white p-8 text-center text-gray-500 rounded-2xl border border-gray-100 font-medium text-lg flex flex-col items-center">
                  <span className="text-4xl mb-3">🏜️</span> No active disputes.
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
