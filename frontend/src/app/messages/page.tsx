"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useUI } from '@/context/UIContext';

export default function Messages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const initialUserName = searchParams.get('name') || 'New Contact';
  const { showAlert } = useUI();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Auth & Socket
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUserInfo(parsedUser);

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join_room', parsedUser._id);

    return () => {
      newSocket.disconnect();
    };
  }, [router]);

  // Fetch Contacts
  useEffect(() => {
    if (!userInfo?.token) return;

    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/chat/contacts', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setContacts(data);
          
          // If we have an initialUserId but it's not in contacts yet, we might want to fetch that specific user to add to the list
          // For simplicity, we just select the active contact if it exists in the list
          if (initialUserId) {
            const existingContact = data.find((c: any) => c._id === initialUserId);
            if (existingContact) {
              setActiveContact(existingContact);
            } else {
              try {
                setActiveContact({ _id: initialUserId, name: initialUserName });
              } catch(e) {}
            }
          } else if (data.length > 0) {
            setActiveContact(data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load contacts', err);
      } finally {
        setLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [userInfo, initialUserId]);

  // Fetch Messages for Active Contact
  useEffect(() => {
    if (!userInfo?.token || !activeContact) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${activeContact._id}`, {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();
  }, [activeContact, userInfo]);

  // Socket Receive Message Listener
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: any) => {
      // Add message if it belongs to the active chat
      if (
        activeContact && 
        (msg.sender === activeContact._id || msg.receiver === activeContact._id)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      } else {
        // Here you might show a generic toast that a new message arrived
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, activeContact]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact || !socket) return;

    const msgData = {
      sender: userInfo._id,
      receiver: activeContact._id,
      content: newMessage.trim(),
    };

    // Emit to socket
    socket.emit('send_message', msgData);
    setNewMessage('');
    
    // If this is a new contact that wasn't in our list, refresh contacts after a short delay
    if (!contacts.find(c => c._id === activeContact._id)) {
      setTimeout(() => {
        fetch('http://localhost:5000/api/chat/contacts', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        }).then(res => res.json()).then(data => setContacts(data));
      }, 500);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="flex-1 bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto h-[80vh] flex bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
        
        {/* Sidebar - Contacts */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h2 className="text-2xl font-extrabold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="p-8 text-center text-gray-500">Loading contacts...</div>
            ) : contacts.length === 0 && !activeContact ? (
              <div className="p-8 text-center text-gray-500 font-medium">No messages yet. Check out the marketplace to contact an artisan!</div>
            ) : (
              <div className="flex flex-col">
                {/* Temporary Contact if not in list yet */}
                {activeContact && !contacts.find(c => c._id === activeContact._id) && (
                  <button 
                    onClick={() => setActiveContact(activeContact)}
                    className="p-5 border-b border-gray-100 text-left transition-all bg-blue-50 border-l-4 border-l-blue-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
                      <div>
                        <h3 className="font-bold text-gray-900">{activeContact.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">Start chatting...</p>
                      </div>
                    </div>
                  </button>
                )}

                {contacts.map((contact) => (
                  <button 
                    key={contact._id} 
                    onClick={() => setActiveContact(contact)}
                    className={`p-5 border-b border-gray-100 text-left transition-all hover:bg-gray-100 ${activeContact?._id === contact._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 flex justify-between">
                          {contact.name}
                          {contact.role === 'entrepreneur' && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Artisan</span>}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">View conversation</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-2/3 flex flex-col bg-white">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white z-10 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {activeContact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">{activeContact.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender === userInfo._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-2 font-medium ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <span className="text-5xl">👋</span>
                    <p className="font-medium">Send a message to start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md flex items-center justify-center"
                  >
                    Send ➔
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
              <span className="text-6xl mb-4">💬</span>
              <h3 className="text-xl font-bold text-gray-600">Your Messages</h3>
              <p>Select a contact from the sidebar to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
