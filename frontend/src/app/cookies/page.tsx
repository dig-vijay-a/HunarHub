export default function Cookies() {
  return (
    <div className="flex-1 bg-gray-50 p-6 animate-fadeIn flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Cookie Policy 🍪</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            HunarHub uses cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help the website remember your actions and preferences over time, so you don't have to keep re-entering them.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">How We Use Cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication:</strong> We use local storage and secure cookies to keep you logged into your account safely.</li>
            <li><strong>Preferences:</strong> To remember your UI settings and marketplace filters.</li>
            <li><strong>Analytics:</strong> To understand how users navigate the marketplace, allowing us to improve platform performance.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-6">Managing Cookies</h2>
          <p>
            You can control or delete cookies at the browser level. However, if you choose to disable cookies, it may limit your use of certain features or functions on our website, such as staying logged in.
          </p>
        </div>
      </div>
    </div>
  );
}
