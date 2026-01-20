'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FeaturesSection } from './components/features-section';
import { Footer } from './components/footer';
import { Header } from './components/header';
import HorariosCard from './components/horariosCard';
import dynamic from 'next/dynamic';

const ADMIN_WHATSAPP = '5493417508'; // Tu número
const WaitingListSection = dynamic(() => import('./components/form'), {
  loading: () => <div className="min-h-screen" />,
  ssr: false,
});
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
        id="inicio"
        className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-8 overflow-hidden"
      >
        <Image
          src="/rio-parana.webp"
          alt="Vista del río Paraná"
          fill
          fetchPriority='high'
          priority
          sizes="100vw"
          className="object-cover"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-900/40 to-blue-900/10" />

        <main className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-2">
              <div className="mb-2 text-blue-600">
                <Image
                  src="/image-sin-fondo.webp"
                  alt="Identidad visual de la guardería"
                  width={320}
                  height={320}
                  sizes="(max-width: 860px) 70vw, 320px"
                  className="h-70 w-70 object-contain"
                />
              </div>

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
                  placeholder="Ej: 3493417508"
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
      <WaitingListSection />
      <HorariosCard />
      <Footer />
    </div>
  );
}
