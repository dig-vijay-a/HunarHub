"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function MyOrders() {
  const [data, setData] = useState<{orders: any[], requests: any[]}>({ orders: [], requests: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showAlert, showPrompt } = useUI();

  const fetchOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        }
      });
      if (res.ok) {
        const fetchedData = await res.json();
        setData(fetchedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fileDispute = async (entrepreneurId: string, orderId: string, orderType: string) => {
    const reason = await showPrompt("File Dispute", "Please briefly describe the issue with this order:");
    if (!reason || !reason.trim()) return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ entrepreneurId, orderType, orderId, reason })
      });
      if (res.ok) {
        showAlert('Dispute Filed', 'Your dispute has been logged. An admin will review it shortly.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xl font-bold bg-gray-50"><span className="animate-spin text-4xl mr-3">⏳</span> Loading Orders...</div>;

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      <main className="max-w-4xl mx-auto p-6 mt-8 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">My History</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📦</span> Product Orders
            </h2>
            {data.orders.length > 0 ? (
              <div className="space-y-4">
                {data.orders.map((order) => (
                  <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-md transition">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{order.product?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-500 mt-1">Qty: {order.quantity} • Total: <span className="font-bold text-emerald-600">${order.totalPrice}</span></p>
                      
                      {(order.status === 'processing' || order.status === 'completed') && (
                        <button onClick={() => fileDispute(order.entrepreneur, order._id, 'Order')} className="text-red-500 text-sm font-medium mt-2 hover:underline">Report Issue</button>
                      )}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-center
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-white p-8 rounded-3xl border border-gray-100 text-center font-medium shadow-sm text-lg">
                You haven't purchased any products yet.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>🛠️</span> Service Requests
            </h2>
            {data.requests.length > 0 ? (
              <div className="space-y-4">
                {data.requests.map((req) => (
                  <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-md transition">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{req.service?.name || 'Unknown Service'}</h3>
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{req.details}"</p>
                      {(req.status === 'accepted' || req.status === 'completed') && (
                        <button onClick={() => fileDispute(req.entrepreneur, req._id, 'ServiceRequest')} className="text-red-500 text-sm font-medium mt-2 hover:underline">Report Issue</button>
                      )}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-center
                      ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${req.status === 'accepted' ? 'bg-blue-100 text-blue-800' : ''}
                      ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${req.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-white p-8 rounded-3xl border border-gray-100 text-center font-medium shadow-sm text-lg">
                You haven't requested any services yet.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
