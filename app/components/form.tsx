import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function WaitingListSection() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        tipoBox: '',
        mensaje: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // 2. Mapeamos los datos del form (camelCase) a lo que espera el Backend (snake_case)
            const payload = {
                name: formData.nombre,
                email: formData.email,
                phone: formData.telefono,
                box_type: formData.tipoBox, // Backend espera "box_type"
                message: formData.mensaje
            };

            const response = await fetch(`${API_URL}/waiting-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: '¡Gracias! Te hemos agregado a nuestra lista de espera. Te contactaremos pronto.'
                });
                setFormData({
                    nombre: '',
                    email: '',
                    telefono: '',
                    tipoBox: '',
                    mensaje: ''
                });
            } else {
                throw new Error('Error al enviar el formulario');
            }
        } catch (error) {
            console.error(error); // Útil para depurar
            setStatus({
                type: 'error',
                message: 'Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Columna Izquierda - Información */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex justify-center md:justify-start md:pl-4 pr-4">
                            <div className=" text-white w-26 h-26 rounded-lg flex items-center justify-center">
                                <img src="/image.svg" alt="" />
                                <h3 className='text-gray-900 font-bold '>GUARDERIA LA CHUECA</h3>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Únete a Nuestra Lista de Espera
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            ¿Interesado en nuestros servicios de guardería de lanchas? Completa el formulario y te contactaremos cuando haya disponibilidad.
                        </p>

                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#0D253F] rounded-full mt-2"></div>
                                <p className="text-gray-600">Ubicación privilegiada en el Río San Javier</p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#0D253F] rounded-full mt-2"></div>
                                <p className="text-gray-600">Seguridad continua con monitoreo</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#0D253F] rounded-full mt-2"></div>
                                <p className="text-gray-600">Acceso las 24 horas del día</p>
                            </div>

                        </div>
                    </div>

                    {/* Columna Derecha - Formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="ejemplo@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    required
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                                    placeholder="3493417508"
                                />
                            </div>

                            <div>
                                <label htmlFor="tipoBox" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tamaño de Box Deseado *
                                </label>
                                <select
                                    id="tipoBox"
                                    name="tipoBox"
                                    required
                                    value={formData.tipoBox}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white"
                                >
                                    <option value="">Selecciona un tamaño</option>
                                    <option value="4x4">Pequeño</option>
                                    <option value="5x5">Mediano</option>
                                    <option value="6x6">Grande</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje (Opcional)
                                </label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    rows={4}
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="Cuéntanos sobre tu embarcación o consultas adicionales..."
                                />
                            </div>

                            {status.message && (
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${status.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {status.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <p className="text-sm">{status.message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        ENVIAR FORMULARIO
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                Al enviar este formulario, aceptas que nos comuniquemos contigo sobre nuestros servicios.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}