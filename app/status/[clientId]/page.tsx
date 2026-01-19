'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { Footer } from '@/app/components/footer';
import { Header } from '@/app/components/header';
import { ClientData } from '@/app/types/api';

// --- CONFIGURACIÓN ---
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_PHONE = '543493417508';

// Datos bancarios (Hardcoded para la UI)
const BANK_DATA = {
  cbu: '0110509430050973175415',
  alias: 'TOMAS.FRANCHINO.BNA',
  titular: 'FRANCHINO TOMAS AGUSTIN',
};
export default function Home() {
  const params = useParams();
  const router = useRouter();
  const clientPhone = params.clientId as string;

  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para el acordeón visual (Traído de estilofront)
  const [showTransferDetails, setShowTransferDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/clients/${clientPhone}`);
        if (!response.ok) {
          throw new Error('Cliente no encontrado o error en el servidor');
        }
        const data = await response.json();
        setClientData(data);
      } catch (err) {
        setError('No pudimos encontrar tu usuario. Verificá el número.');
      } finally {
        setLoading(false);
      }
    };

    if (clientPhone) fetchData();
  }, [clientPhone]);

  const handleWhatsAppClick = (type: 'DEBT' | 'PREPAY', details?: string) => {
    if (!clientData) return;

    let text = '';
    if (type === 'DEBT') {
      text = `Hola, soy ${clientData.name} (Box ${clientData.box_number}). A continuacion envío comprobante del pago.`;
    } else {
      text = `Hola, soy ${clientData.name}. Me interesa el plan de *${details}* para fijar el precio.`;
    }

    const message = encodeURIComponent(text);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${message}`, '_blank');
  };

  // --- CÁLCULOS ---
  const hasDebt = clientData && clientData.current_debt > 0;
  const pendingPayments = clientData?.payments?.filter(p => p.status === 'PENDING') ?? [];
  // Calculamos el subtotal puro sumando los montos
  const subTotalAmount = pendingPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // --- RENDERIZADO ---

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error || !clientData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm border border-gray-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ocurrió un error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => router.push('/')} className="text-blue-600 font-bold underline hover:text-blue-800">
          Volver a intentar
        </button>
      </div>
    </div>
  );

  return (
    // Usamos bg-gray-100 para simular bg-secondary
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <Header />
      {/* Header with back button */}


      <div className="max-w-md mx-auto py-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-900 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto pb-8">
        {/* Greeting */}

        <h1 className="text-2xl font-medium text-center mb-6">
          Hola, <span className="font-bold">{clientData.name}</span>
        </h1>

        {hasDebt ? (
          <>
            {/* --- ESTADO: CON DEUDA (Estilo EstiloFront) --- */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">

              {/* Header Rojo */}
              <div className="bg-red-600 text-white px-6 py-4 text-center">
                <h2 className="text-xl font-bold tracking-wide">TIENES UN PAGO PENDIENTE</h2>
              </div>

              {/* Payment Details */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Detalle de Deuda
                  </h3>

                  {/* Lista de meses pendientes */}
                  <div className="space-y-3 mb-4">
                    {pendingPayments.map((p) => (
                      <div key={p.id} className="flex justify-between items-center text-sm border-b border-gray-200 pb-2 last:border-0">
                        <span className="text-gray-500 capitalize">{p.month_period}</span>
                        <div className="flex items-center gap-2">
                          {/* Si quisieras mostrar precio original tachado, podrías hacerlo aquí */}
                          <span className="font-semibold text-gray-900">
                            ${p.amount.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sección de Total y Descuento */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    {clientData.has_discount_current_month ? (
                      <>
                        <p className="text-sm font-medium text-green-600 mb-2">
                          🔥 PAGANDO ANTES DEL DÍA 25:
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Total con Desc.:</span>
                          <span className="font-bold text-2xl text-green-600">
                            $ {clientData.current_debt.toLocaleString("es-AR")}
                          </span>
                        </div>
                        <p className="text-xs text-right text-green-700 font-medium">(8% OFF incluido)</p>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Total a Pagar:</span>
                        <span className="font-bold text-2xl text-gray-900">
                          $ {clientData.current_debt.toLocaleString("es-AR")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Aviso de vencimiento (Estético) */}
                  {clientData.has_discount_current_month && (
                    <div className="bg-red-50 rounded-md px-4 py-2 text-center border border-red-100">
                      <span className="text-sm font-medium text-red-600">
                        El descuento vence pronto
                      </span>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <p className="text-sm text-gray-500 text-center mb-4">
                  Coordina el pago en efectivo o por transferencia y envía el comprobante por WhatsApp:
                </p>

                {/* WhatsApp CTA Button (Estilo Shadcn Button size=lg) */}
                <button
                  onClick={() => handleWhatsAppClick('DEBT')}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-8 rounded-md transition-colors shadow-sm flex items-center justify-center gap-2 mb-4"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Informar Pago
                </button>

                {/* Transfer Details Accordion */}
                <button
                  onClick={() => setShowTransferDetails(!showTransferDetails)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors py-2"
                >
                  <span>Datos de Transferencia (CBU)</span>
                  {showTransferDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTransferDetails && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-gray-900 block">CBU:</span>
                        <p className="text-gray-600 font-mono tracking-wide bg-white p-1 rounded border border-gray-200 mt-1">
                          {BANK_DATA.cbu}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <span className="font-semibold text-gray-900 block">Alias:</span>
                          <p className="text-gray-600">{BANK_DATA.alias}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block">Titular:</span>
                        <p className="text-gray-600 uppercase">{BANK_DATA.titular}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* --- ESTADO: AL DÍA (Estilo EstiloFront) --- */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6">
              <div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-100">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-blue-700 mb-4">ESTÁS AL DÍA</h2>

                <p className="text-gray-500 mb-6">
                  No tienes pagos pendientes.
                </p>

                <p className="text-lg font-semibold text-gray-900">¡A disfrutar el río! 🚤</p>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Box N°: <span className="font-bold text-gray-900 text-lg">{clientData.box_number}</span>
                </p>
              </div>
            </div>
          </>
        )}

        {/* --- SECCIÓN: CONGELAR PRECIO (Adaptada al estilo EstiloFront) --- */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-2 mb-4 text-gray-800">
            <span className="text-xl">🎣</span>
            <h3 className="text-lg font-bold">Fija el Precio</h3>
          </div>

          <div className="grid gap-3">
            {clientData.prepayment_options.map((option) => (
              <div key={option.months} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative overflow-hidden flex justify-between items-center">

                {/* Badge de Ahorro */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  AHORRA ${option.savings.toLocaleString('es-AR')}
                </div>

                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">{option.months} Meses</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${option.total_amount.toLocaleString('es-AR')}
                  </p>
                </div>

                <button
                  onClick={() => handleWhatsAppClick('PREPAY', `${option.months} meses`)}
                  className="text-blue-600 border border-blue-200 hover:bg-blue-50 font-medium py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Elegir
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
