export default function Safety() {
  return (
    <div className="flex-1 bg-gray-50 p-6 animate-fadeIn flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Safety Guidelines 🛡️</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            At HunarHub, the safety and trust of our community are our highest priorities. Whether you are a customer purchasing handmade goods or an entrepreneur offering services, we expect everyone to adhere to these core principles.
          </p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-6">1. Verified Profiles</h2>
          <p>
            We encourage all customers to check an entrepreneur's verification status and past reviews before making a large purchase. Verified profiles have undergone checks by our Admin team.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">2. Secure Communications</h2>
          <p>
            Always keep your communications and transactions on the HunarHub platform. This ensures that you are protected by our dispute resolution team if anything goes wrong.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6">3. Meeting in Person</h2>
          <p>
            For services that require in-person meetings (such as carpentry, tailoring, or pottery classes), always arrange to meet in safe, public, or mutually agreed-upon environments. If you feel unsafe at any time, please cancel the service and report it to us immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
