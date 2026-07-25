export default function Help() {
  return (
    <div className="flex-1 bg-gray-50 p-6 animate-fadeIn flex flex-col justify-center py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Help Center 🏥</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">How do I book a service?</h2>
            <p className="text-gray-600 leading-relaxed">
              To book a service, navigate to the Marketplace, find the service you are interested in, and click the "Book Now" button. You will be prompted to provide any specific details or preferred times for your booking. Once submitted, the entrepreneur will review your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">How do I become an entrepreneur?</h2>
            <p className="text-gray-600 leading-relaxed">
              Click on "Join as a Seller" on the homepage or navigation bar. Fill out your details, select your primary trade category, and create your profile. Once your profile is created, you can start listing products and services immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">What happens if I have a dispute?</h2>
            <p className="text-gray-600 leading-relaxed">
              If an order or service does not meet expectations, you can raise a dispute directly from your "My Orders" page. Our admin team monitors all active disputes and will step in to mediate and resolve the issue between you and the entrepreneur.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
