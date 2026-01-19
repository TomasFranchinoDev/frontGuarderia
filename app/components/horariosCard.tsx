import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function LocationSection() {
    return (
        <section className="w-full bg-gray-200 from-slate-50 to-slate-100 py-12 px-4 sm:py-16 md:py-20">

            <div className="max-w-7xl mx-auto">

                {/* Grid de contenido 2x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 ">
                    {/* Imagen - Arriba Izquierda */}
                    <div className="relative overflow-hidden rounded-2xl shadow-xl h-64 sm:h-80 md:h-96 group">
                        {/* Imagen */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl h-64 sm:h-80 md:h-96 group">
                            <img
                                src="/guarderia-fondo.webp"
                                alt="Nuestra oficina"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Nuestros boxes</h3>
                                <p className="text-sm sm:text-base text-slate-200">
                                    Un ambiente diseñado para tu comodidad
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Texto - Arriba Derecha */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col justify-center">

                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                            <img className='h-16 w-16' src="border-top-svgrepo-com.svg" /> Dimensiones de los Boxes
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm sm:text-base leading-relaxed">
                            Contamos con 3 tamaños de boxes.
                        </p>
                        <p className="text-slate-600 mb-4 text-sm sm:text-base leading-relaxed">
                            Pequeños, medianos o grandes, diseñados para adaptarse a cualquier tamaño de embarcación.
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Nuestro equipo está listo para atenderte y resolver todas tus consultas. ¡Esperamos verte pronto!
                        </p>
                    </div>

                    {/* Texto - Abajo Izquierda */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                            <img className='h-12 w-12' src="place-svgrepo-com.svg" /> Ubicación
                        </h3>
                        <p className="text-slate-600 mb-4 text-sm sm:text-base leading-relaxed">
                            Fácil Acceso a 4 cuadras de la Ruta 1 y del Río San Javier
                        </p>
                        <p className="text-slate-600 mb-4 text-sm sm:text-base leading-relaxed">
                            Saladero cuenta con bajada al río, y es una excelente zona de pesca deportiva.
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Utiliza el mapa para planificar tu visita y encontrar la mejor ruta desde tu ubicación.
                        </p>
                    </div>

                    {/* Mapa - Abajo Derecha */}
                    <div className="relative overflow-hidden rounded-2xl shadow-xl h-64 sm:h-80 md:h-96">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d856.0731662383406!2d-60.03437233045229!3d-30.87847284739325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b4b10057ee6711%3A0xfb5669fe2ead5935!2sGuarderia%20La%20Chueca!5e0!3m2!1ses-419!2sar!4v1768759952174!5m2!1ses-419!2sar" 
                            width="600" 
                            height="450" 
                            style={{ border: 0 }} 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
