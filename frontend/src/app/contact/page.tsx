"use client";

export default function Contact() {
  return (
    <div className="flex-1 bg-gray-50 p-6 animate-fadeIn flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12">
        
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us 📞</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Have a question, suggestion, or concern? We'd love to hear from you. Our support team typically responds within 24 hours.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900">Email</h3>
              <p className="text-emerald-600 font-medium">support@hunarhub.com</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Office</h3>
              <p className="text-gray-600">123 Innovation Drive<br/>Tech Hub, New Delhi, 110001</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 min-h-[120px]" placeholder="How can we help?"></textarea>
            </div>
            <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  );
}
