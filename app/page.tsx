'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeaturesSection } from './components/features-section';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { HeroSection } from './components/hero-section';

const ADMIN_WHATSAPP = '5493493XXXXXX'; // Tu número

export default function Home() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      // Redirigimos usando el teléfono como ID
      router.push(`/status/${phone.trim()}`);
    }
  };

  return (
    <div>
      
      
      <Header />
      
    <div 
    style={{
    backgroundImage: 'url("/rio-parana.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
    className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-8">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 text-blue-600">
              {/* Icono de Ancla/Barco */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ship h-15 w-15" aria-hidden="true"><path d="M12 10.189V14"></path><path d="M12 2v3"></path><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"></path><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"></path><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Guardería Náutica
            </h1>
            <p className="text-lg text-gray-600 text-center mt-3">
              Consulta tu Estado
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa tu número de celular
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 3493123456"
                className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Ingresa el número con el que te registraste (sin 0 ni 15).
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              CONSULTAR MI DEUDA
            </button>
          </form>
        </div>
      </main>
      </div>
      <FeaturesSection />
      <Footer />
    </div>
  );
}
