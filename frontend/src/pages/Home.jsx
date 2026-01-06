import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Home() {
  const learnMoreRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Header />
      <main>
        {/* HERO SECTION */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">RiskGuard Insurance Platform</h1>
            <p className="text-xl mb-8 text-blue-100">Intelligent risk assessment and insurance underwriting</p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn-primary">Get Started</Link>
              <button onClick={handleLearnMore} className="btn-secondary">Learn More</button>
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section ref={learnMoreRef} className="py-16 bg-gray-50" id="learn-more">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Health Insurance', 
                  desc: 'Comprehensive health coverage for you and your family',
                  features: ['Hospital coverage', 'Outpatient care', 'Medical emergencies', 'Preventive care'],
                  details: 'Our Health Insurance plans provide comprehensive coverage for all your medical needs. Whether it\'s routine checkups, emergency care, or specialized treatments, we\'ve got you covered. Plans start from affordable premiums with flexible payment options.',
                  coverage: ['Up to $100K hospital coverage', 'Cashless treatment at 5000+ hospitals', 'No waiting period for emergencies', 'Family plans available']
                },
                { 
                  title: 'Life Insurance', 
                  desc: 'Secure your family\'s future with our life insurance plans',
                  features: ['Financial protection', 'Family security', 'Flexible terms', 'Claim support'],
                  details: 'Protect your family\'s financial future with our Life Insurance plans. Choose from term life or whole life coverage based on your needs. Get instant policy issuance and hassle-free claims.',
                  coverage: ['Coverage up to $500K', 'Fast claim settlement', 'Online policy purchase', 'Flexible payment terms']
                },
                { 
                  title: 'Motor Insurance', 
                  desc: 'Complete protection for your vehicle against all risks',
                  features: ['Collision coverage', '24/7 roadside support', 'Fast claims', 'Third-party liability'],
                  details: 'Drive with confidence with our Motor Insurance coverage. Get protection against accidents, theft, and natural disasters. Our network includes quick claims processing and 24/7 customer support.',
                  coverage: ['Comprehensive coverage', '24/7 roadside assistance', 'Zero depreciation cover', 'Personal accident cover']
                }
              ].map((prod, idx) => (
                <div key={idx} className="card hover:shadow-2xl transition-shadow duration-300">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-3 text-center">{prod.title}</h3>
                    <p className="text-gray-600 mb-6 text-center text-sm">{prod.desc}</p>
                    
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Key Features:</p>
                      <ul className="space-y-2">
                        {prod.features.map((feature, fIdx) => (
                          <li key={fIdx} className="text-sm text-gray-600 flex items-center">
                            <span className="text-primary mr-2">✓</span>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => setSelectedProduct(prod)}
                      className="btn-primary btn-block text-center"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-3xl font-bold hover:text-blue-200 transition"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">About This Plan</h3>
                  <p className="text-gray-600">{selectedProduct.details}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Coverage Highlights</h3>
                  <ul className="space-y-2">
                    {selectedProduct.coverage.map((cov, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✓</span>{cov}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Ready to apply?</span> Login to your account or create a new one to explore and apply for this plan.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
                  >
                    Close
                  </button>
                  <Link 
                    to="/login"
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
