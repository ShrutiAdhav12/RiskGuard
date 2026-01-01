import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function Home() {
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
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Health Insurance', desc: 'Comprehensive health coverage for you and your family' },
                { title: 'Life Insurance', desc: 'Secure your family\'s future with our life insurance plans' },
                { title: 'Motor Insurance', desc: 'Complete protection for your vehicle against all risks' }
              ].map((prod, idx) => (
                <div key={idx} className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-3">{prod.title}</h3>
                    <p className="text-gray-600 mb-6">{prod.desc}</p>
                    <button className="btn-primary btn-small">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
