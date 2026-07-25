export default function Privacy() {
  return (
    <div className="flex-1 bg-gray-50 p-6 animate-fadeIn flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy 🕵️‍♂️</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>
            At HunarHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal data when you use our platform to discover and connect with local micro-entrepreneurs.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">Information We Collect</h2>
          <p>
            When you register on HunarHub, we collect basic profile information such as your name, email address, and role (customer or entrepreneur). If you are an entrepreneur, we also collect your location, skills, and bio to display on your public profile.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">How We Use Your Data</h2>
          <p>
            Your data is used strictly to facilitate transactions and bookings on the platform. We do not sell your personal information to third parties. We use your email to send you updates regarding your orders, service requests, and active disputes.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">Data Security</h2>
          <p>
            We implement industry-standard encryption and secure database practices to protect your data against unauthorized access, alteration, or disclosure.
          </p>
        </div>
      </div>
    </div>
  );
}
