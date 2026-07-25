"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function Marketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('services'); // 'services' or 'products'
  const [loading, setLoading] = useState(true);

  // Filter states
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategoriesData(data))
      .catch(console.error);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await fetch(`http://localhost:5000/api/marketplace/${filter}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const { showAlert, showPrompt } = useUI();

  const handlePurchase = async (item: any) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      showAlert('Login Required', 'You must be logged in to make a purchase or booking.');
      return;
    }
    if (userInfo.role !== 'customer') {
      showAlert('Error', 'Only customers can book services or buy products.');
      return;
    }

    if (filter === 'services') {
      const details = await showPrompt('Book Service', `Please provide details or preferred time for booking "${item.name}":`);
      if (!details) return;

      try {
        const res = await fetch('http://localhost:5000/api/orders/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
          body: JSON.stringify({ serviceId: item._id, details })
        });
        if (res.ok) showAlert('Success', 'Service request sent successfully! You can track it in My Orders.');
        else showAlert('Error', 'Failed to send request.');
      } catch (err) {
        console.error(err);
      }
    } else {
      const qtyStr = await showPrompt('Buy Product', `How many "${item.name}" would you like to buy?`);
      if (!qtyStr) return;
      const quantity = parseInt(qtyStr, 10);
      if (isNaN(quantity) || quantity < 1) {
        showAlert('Invalid Input', 'Please enter a valid quantity.');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/orders/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
          body: JSON.stringify({ productId: item._id, quantity })
        });
        if (res.ok) showAlert('Success', 'Order placed successfully! You can track it in My Orders.');
        else showAlert('Error', 'Failed to place order.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 mt-6 flex flex-col md:flex-row gap-8 animate-fadeIn">
        
        {/* Sidebar for Filters */}
        <aside className="w-full md:w-72 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 h-fit">
          <h3 className="font-extrabold text-2xl text-gray-900 border-b pb-4">Filters</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
            <input 
              type="text" 
              placeholder="Search name..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <input 
              type="text" 
              placeholder="City or Region..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"
            >
              <option value="">All Categories</option>
              {categoriesData.map((cat: any) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min $" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input 
                type="number" 
                placeholder="Max $" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button 
            onClick={fetchItems}
            className="w-full py-3 mt-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md"
          >
            Apply Filters
          </button>
        </aside>

        <div className="flex-1">
          <div className="flex justify-center md:justify-start gap-4 mb-8">
            <button 
              onClick={() => setFilter('services')}
              className={`px-8 py-3 rounded-full font-bold transition-all shadow-sm ${filter === 'services' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setFilter('products')}
              className={`px-8 py-3 rounded-full font-bold transition-all shadow-sm ${filter === 'products' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              Handmade Products
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 font-bold text-xl py-20 flex justify-center items-center">
              <span className="animate-spin text-4xl mr-3">⏳</span> Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group">
                  <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-6xl overflow-hidden relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="group-hover:scale-105 transition-transform duration-300">{filter === 'services' ? '🛠️' : '🛍️'}</span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col z-10 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2">
                        ${filter === 'services' ? item.basePrice : item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                    <div className="mt-auto border-t pt-4 flex justify-between items-center">
                      <Link href={`/entrepreneur/${item.entrepreneur?._id}`} className="text-sm text-gray-500 font-medium flex items-center gap-2 hover:text-emerald-600 transition">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                          {item.entrepreneur?.imageUrl ? <img src={item.entrepreneur.imageUrl} className="w-full h-full object-cover" /> : <span className="text-[10px]">👤</span>}
                        </div>
                        <span className="truncate max-w-[100px]">{item.entrepreneur?.user?.name}</span>
                      </Link>
                      <button onClick={() => handlePurchase(item)} className="text-emerald-600 font-bold hover:text-emerald-700 transition">
                        {filter === 'services' ? 'Book Now ➔' : 'Buy Now ➔'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-5xl mb-4">🏜️</div>
                  <h3 className="text-2xl font-bold text-gray-700">No results found</h3>
                  <p className="mt-2">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
