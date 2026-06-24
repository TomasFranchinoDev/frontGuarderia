'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Settings, Users, Search, Plus,
    Trash2, Edit2, X, DollarSign, Clock, RefreshCw, ArrowLeft, BarChart3, TrendingUp, AlertTriangle, CreditCard, MessageCircle, Home, CheckCircle, ListOrdered, Target, } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- TIPOS (Types) ---
type Transaction = {
    id: string;
    amount_paid: number;
    payment_date: string;
    method: string;
};

type Charge = {
    id: string;
    total_amount: number;
    month_period: string;
    status: 'PENDING' | 'PARTIAL' | 'PAID';
    transactions: Transaction[];
};

type Client = {
    id: string;
    name: string;
    phone: string;
    box_number: number;
    status: 'ACTIVE' | 'DEBTOR';
    is_active: boolean;
    credit_balance: number;
    charges: Charge[];
    current_debt: number;
};

type WaitlistEntry = {
    id: string;
    name: string;
    email: string;
    phone: string;
    box_size: string;
    message?: string | null;
    created_at?: string | null;
};

type OccupancyStats = {
    occupancy_rate: number;
    available_boxes: number;
    occupied_boxes: number;
    total_rentable_boxes: number;
    potential_revenue: number;
    waitlist_count: number;
    top_waitlist: { name: string, phone: string, box_size: string }[];
};

type DashboardStats = {
    current_month: { invoiced: number, paid: number, cash: number, transfer: number },
    last_year: { invoiced: number, paid: number, cash: number, transfer: number },
    total_debt: number,
    top_debtors: { name: string, phone: string, debt: number }[],
    history: { month: string, revenue: number }[],
    occupancy: OccupancyStats
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
    // --- ESTADOS GLOBALES ---
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'settings' | 'waitlist'>('dashboard');
        const [loginError, setLoginError] = useState('');

    // --- LÓGICA DE LOGIN ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (!secret.trim()) {
            setLoginError('Ingresa tu Contraseña');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/settings/fee`, {
                headers: { 'x-admin-secret': secret }
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setLoginError('Contraseña inválida');
                } else if (res.status === 429) {
                    setLoginError('Demasiados intentos. Espera 1 minuto.');
                } else {
                    setLoginError('Error al verificar contraseña');
                }
                setIsAuthenticated(false);
                return;
            }

            setIsAuthenticated(true);
        } catch {
            setLoginError('No se pudo verificar, revisa la conexión');
        }
    };

    // Renderizado Condicional
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/image-sin-fondo.webp"
                            alt="Logo Guardería"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Panel Administrador</h2>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Ingresa tu Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                    />
                    {loginError && <p className="text-sm text-red-600 mb-3 text-center">{loginError}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition mb-4">
                        Ingresar
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
                    >
                        <ArrowLeft size={16} />
                        Volver a la página principal
                    </Link>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Admin */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 sticky top-0 z-10">
                <div className="flex items-center gap-3 font-bold text-lg md:text-xl">
                    <Image
                        src="/image-sin-fondo.webp"
                        alt="Logo"
                        width={36}
                        height={36}
                        className="object-contain"
                    />
                    <span>Panel Administrador</span>
                </div>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Cerrar Sesión
                </button>
            </header>

            {/* Tabs de Navegación */}
            <div className="flex justify-start sm:justify-center bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-3 md:px-6 flex items-center gap-2 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    <BarChart3 size={18} /> Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`px-4 py-3 md:px-6 flex items-center gap-2 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'clients' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    <Users size={18} /> Clientes y Pagos
                </button>
                <button
                    onClick={() => setActiveTab('waitlist')}
                    className={`px-4 py-3 md:px-6 flex items-center gap-2 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'waitlist' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    <Clock size={18} /> Lista de Espera
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-3 md:px-6 flex items-center gap-2 text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                >
                    <Settings size={18} /> Configuración
                </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto overflow-x-hidden">
                {activeTab === 'dashboard' && <DashboardView secret={secret} />}
                {activeTab === 'clients' && <ClientsView secret={secret} />}
                {activeTab === 'waitlist' && <WaitlistView secret={secret} />}
                {activeTab === 'settings' && <SettingsView secret={secret} />}
            </main>
        </div>
    );
}

// ==========================================
// VISTA 1: CONFIGURACIÓN (PRECIO)
// ==========================================
function SettingsView({ secret }: { secret: string }) {
    const [feeSmall, setFeeSmall] = useState<string>('');
    const [feeLarge, setFeeLarge] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [generatingDebt, setGeneratingDebt] = useState(false);
    const [debtMsg, setDebtMsg] = useState('');
    const [selectedDebtMonth, setSelectedDebtMonth] = useState<'current' | 'next'>('current');
    const [clientsForMessages, setClientsForMessages] = useState<Client[]>([]);
    const [clientsLoading, setClientsLoading] = useState(false);
    const [clientsError, setClientsError] = useState('');

    // Cargar precio actual al montar
    useEffect(() => {
        const loadFee = async () => {
            setError('');
            try {
                const res = await fetch(`${API_URL}/admin/settings/fee`, { headers: { 'x-admin-secret': secret } });

                if (res.status === 404) {
                    setFeeSmall('');
                    setFeeLarge('');
                    setMsg('Configura el valor por primera vez');
                    return;
                }

                if (!res.ok) {
                    setError('No se pudo cargar el valor');
                    return;
                }

                const data = await res.json();
                if (data) {
                    if (data.fee_small !== undefined) {
                        setFeeSmall(data.fee_small.toString());
                    } else if (data.value !== undefined) {
                        setFeeSmall(data.value.toString());
                    }

                    if (data.fee_large !== undefined) {
                        setFeeLarge(data.fee_large.toString());
                    } else if (data.value !== undefined) {
                        setFeeLarge(data.value.toString());
                    }
                }
            } catch {
                setError('Error de conexión al cargar la cuota');
            }
        };

        loadFee();
    }, [secret]);

    useEffect(() => {
        const loadClientsForMessages = async () => {
            setClientsLoading(true);
            setClientsError('');
            try {
                const res = await fetch(`${API_URL}/admin/clients`, {
                    headers: { 'x-admin-secret': secret }
                });

                if (!res.ok) {
                    setClientsError('No pude cargar la lista de clientes');
                    setClientsForMessages([]);
                    return;
                }

                const data = await res.json();
                setClientsForMessages(Array.isArray(data) ? data : []);
            } catch {
                setClientsError('No pude cargar la lista de clientes');
                setClientsForMessages([]);
            } finally {
                setClientsLoading(false);
            }
        };

        loadClientsForMessages();
    }, [secret]);

    const buildWhatsAppLink = (client: Client) => {
        const message = `Hola ${client.name.split(" ")[0]} 👋, buen día.\nTe escribo para recordarte que el 10 vence el plazo para abonar tu cuota de la guarderia con descuento 🚤. \nPodés ver tu saldo actualizado, los datos de la cuenta y planes de pago en el siguiente link:\n🔗https://guarderialachueca.com/status/${client.phone} \n👉Importante:\n- En caso de transferir enviá el comprobante por este chat.\n- Si pagás en efectivo, escribime para coordinar.`;
        return `https://wa.me/${client.phone}?text=${encodeURIComponent(message)}`;
    };

    const handleUpdate = async () => {
        setError('');
        setLoading(true);
        try {
            const parsedSmall = parseFloat(feeSmall);
            const parsedLarge = parseFloat(feeLarge);
            if (!Number.isFinite(parsedSmall) || parsedSmall <= 0 || !Number.isFinite(parsedLarge) || parsedLarge <= 0) {
                setError('Ingresa valores numéricos mayores a 0');
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/admin/settings/fee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({ fee_small: parsedSmall, fee_large: parsedLarge })
            });
            if (res.ok) {
                const data = await res.json();
                setMsg(`✅ Precio actualizado correctamente. ${data.charges_updated || 0} pagos pendientes recalculados.`);
            }
            else setMsg('❌ Error al actualizar');
        } catch {
            setMsg('❌ Error de conexión');
        }
        setLoading(false);
    };

    // Con esta nueva función unificada:
    const handleGenerateDebt = async (isNextMonth: boolean = false) => {
        setDebtMsg('');
        const monthText = isNextMonth ? 'del mes siguiente' : 'del mes actual';
        const ok = window.confirm(`¿Generar cuotas mensuales para todos los clientes activos ${monthText}?`);
        if (!ok) return;

        setGeneratingDebt(true);
        try {
            const params = new URLSearchParams();
            if (isNextMonth) {
                params.append('next_month', 'true');
            }

            const url = new URL(`${API_URL}/webhook/generate-monthly-debt`);
            url.search = params.toString();

            const res = await fetch(url.toString(), {
                method: 'POST',
                headers: { 'x-webhook-secret': secret }
            });

            if (!res.ok) {
                setDebtMsg('❌ Error al generar deudas');
                setGeneratingDebt(false);
                return;
            }

            const data = await res.json();
            setDebtMsg(`✅ ${data.message}. Periodo: ${data.period}. Pagos creados: ${data.payments_created}`);
        } catch {
            setDebtMsg('❌ Error de conexión al generar deudas');
        }
        setGeneratingDebt(false);
    };

    return (
        <div className="space-y-4 md:space-y-6 max-w-full md:max-w-md md:mx-auto">
            {/* Sección de Precio */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={20} />
                    Valor de Cuota Mensual
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    Este valor afectará a las nuevas deudas generadas y recalculará los pagos pendientes existentes.
                </p>

                <div className="space-y-3 md:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Precio Boxes Grandes (1-10) ($)</label>
                            <input
                                type="number"
                                value={feeLarge}
                                onChange={e => setFeeLarge(e.target.value)}
                                className="w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base text-gray-900 bg-white"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Precio Boxes Chicos (11-29) ($)</label>
                            <input
                                type="number"
                                value={feeSmall}
                                onChange={e => setFeeSmall(e.target.value)}
                                className="w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base text-gray-900 bg-white"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
                    >
                        {loading ? 'Guardando...' : 'Actualizar Precio'}
                    </button>
                    {msg && <p className="text-center text-xs md:text-sm font-medium animate-pulse">{msg}</p>}
                    {error && <p className="text-center text-xs md:text-sm text-red-600">{error}</p>}
                </div>
            </div>

            {/* Sección de Generar Deudas Mensuales */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                    <DollarSign className="text-orange-600" size={20} />
                    Generar Deudas Mensuales
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    Crea automáticamente las cuotas para todos los clientes activos del mes seleccionado.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={selectedDebtMonth}
                        onChange={(e) => setSelectedDebtMonth(e.target.value as 'current' | 'next')}
                        className="px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base outline-none focus:ring-2 focus:ring-orange-500 flex-1 bg-gray-50"
                        disabled={generatingDebt}
                    >
                        <option value="current">Mes Actual</option>
                        <option value="next">Mes Siguiente</option>
                    </select>
                    <button
                        onClick={() => handleGenerateDebt(selectedDebtMonth === 'next')}
                        disabled={generatingDebt}
                        className="bg-orange-600 text-white font-bold px-6 py-2 md:py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm md:text-base whitespace-nowrap transition-colors"
                    >
                        {generatingDebt ? 'Generando...' : 'Generar Cuotas'}
                    </button>
                </div>
                {debtMsg && <p className="text-center text-xs md:text-sm font-medium mt-3 animate-pulse">{debtMsg}</p>}
            </div>

            <div>
                {/* Sección de mensajes personalizados para mis clientes */}
                <div className="bg-white rounded-xl shadow p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                        <Settings className="text-gray-600" size={20} />
                        Mensajes Personalizados para Clientes
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                        Links de WhatsApp con marca de deuda por cliente
                    </p>
                    <div className="text-sm md:text-base text-gray-700 space-y-3">
                        {clientsLoading && <p className="text-sm text-gray-500">Cargando clientes...</p>}
                        {clientsError && <p className="text-sm text-red-600">{clientsError}</p>}
                        {!clientsLoading && !clientsError && clientsForMessages.length === 0 && (
                            <p className="text-sm text-gray-500">No hay clientes cargados.</p>
                        )}
                        {!clientsLoading && !clientsError && clientsForMessages.length > 0 && (
                            <p className="text-xs md:text-sm text-gray-600">Total: {clientsForMessages.length}</p>
                        )}
                        {!clientsLoading && !clientsError && clientsForMessages.map(client => {
                            const hasDebt = client.current_debt > 0;
                            return (
                                <div key={client.id} className="border rounded-lg p-3 md:p-4 space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">{client.name}</p>
                                            <p className="text-xs md:text-sm text-gray-500">{client.phone}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${hasDebt ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {hasDebt ? '⚠️ Debe' : '✅ No debe'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-xs md:text-sm text-gray-700">
                                        <span className="font-medium">Deuda: ${client.current_debt.toLocaleString()}</span>
                                        <a
                                            className="text-purple-600 underline font-semibold"
                                            target="_blank"
                                            rel="noreferrer"
                                            href={buildWhatsAppLink(client)}
                                        >
                                            Enviar
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        </div>
    );
}

// ==========================================
// VISTA 2: CLIENTES Y PAGOS (CRUD)
// ==========================================
function ClientsView({ secret }: { secret: string }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('active');
    const [listMsg, setListMsg] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null); // Para el Modal
    const [showCreate, setShowCreate] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const fetchClients = async () => {
        try {
            const url = `${API_URL}/admin/clients?is_active=${statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : 'all'}`;
            const res = await fetch(url, {
                headers: { 'x-admin-secret': secret }
            });

            if (!res.ok) {
                setClients([]);
                setListMsg('Error al cargar clientes');
                return;
            }

            const data = await res.json();
            setClients(Array.isArray(data) ? data : []);
            setListMsg(Array.isArray(data) && data.length === 0 ? 'No hay clientes cargados' : '');
        } catch {
            setClients([]);
            setListMsg('Error de red al cargar clientes');
        }
    };

    useEffect(() => {
        fetchClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secret, statusFilter]);

    // Sincronizar el modal seleccionado cuando los datos de clientes cambien
    useEffect(() => {
        if (selectedClient) {
            const updatedClient = clients.find(c => c.id === selectedClient.id);
            if (updatedClient && JSON.stringify(updatedClient) !== JSON.stringify(selectedClient)) {
                setSelectedClient(updatedClient);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clients]);

    // Filtrado simple frontend
    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    const handleDeleteClient = async (client: Client) => {
        const ok = window.confirm(`¿Eliminar al cliente "${client.name}" y TODOS sus pagos?`);
        if (!ok) return;
        setDeletingId(client.id);
        try {
            const res = await fetch(`${API_URL}/admin/clients/${client.id}`, {
                method: 'DELETE',
                headers: { 'x-admin-secret': secret }
            });
            if (!res.ok) {
                const text = await res.text();
                alert(text || 'No se pudo eliminar el cliente');
                setDeletingId(null);
                return;
            }
            await fetchClients();
        } catch {
            alert('Error de red al eliminar');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {/* Barra de Herramientas */}
            <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full items-start sm:items-center">
                    <div className="relative flex-1 sm:flex-initial sm:w-64 md:w-72">
                        <Search className="absolute left-3 top-2.5 md:top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filtrar por nombre o teléfono"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 md:pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'active' | 'inactive' | 'all')}
                        className="px-3 py-2 border rounded-lg text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 cursor-pointer w-full sm:w-auto"
                    >
                        <option value="active">Solo Activos</option>
                        <option value="inactive">Solo Inactivos</option>
                        <option value="all">Todos los Clientes</option>
                    </select>
                    <button
                        onClick={fetchClients}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto"
                    >
                        Refrescar
                    </button>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 text-sm md:text-base"
                >
                    <Plus size={18} /> Nuevo Cliente
                </button>
            </div>

            {/* Tabla de Clientes - Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Teléfono</th>
                            <th className="px-6 py-4">Box</th>
                            <th className="px-6 py-4">Deuda Total</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.map(client => (
                            <tr key={client.id} className={`hover:bg-gray-50 transition ${!client.is_active ? 'opacity-50 grayscale' : ''}`}>
                                <td className="px-6 py-4 font-medium">
                                    {client.name}
                                    {!client.is_active && <span className="ml-2 text-xs text-red-500 font-bold">(Inactivo)</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{client.phone}</td>
                                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{client.box_number}</span></td>
                                <td className="px-6 py-4">
                                    <div className={`font-bold ${client.current_debt > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                        ${client.current_debt.toLocaleString()}
                                    </div>
                                    {client.credit_balance > 0 && (
                                        <div className="text-xs text-green-600 font-bold mt-1">
                                            A favor: ${client.credit_balance.toLocaleString()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 flex justify-center gap-3">
                                    <button
                                        onClick={() => setSelectedClient(client)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Edit2 size={16} /> Gestionar Pagos
                                    </button>
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className="text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
                                        title="Editar cliente"
                                    >
                                        <Edit2 size={16} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClient(client)}
                                        disabled={deletingId === client.id}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                                        title="Eliminar cliente"
                                    >
                                        <Trash2 size={16} /> {deletingId === client.id ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredClients.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    {listMsg || 'No se encontraron clientes'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tarjetas de Clientes - Mobile */}
            <div className="md:hidden space-y-3">
                {filteredClients.map(client => (
                    <div key={client.id} className={`bg-white rounded-xl shadow p-4 ${!client.is_active ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">
                                    {client.name}
                                    {!client.is_active && <span className="ml-2 text-xs text-red-500 font-bold">(Inactivo)</span>}
                                </h3>
                                <p className="text-sm text-gray-500">{client.phone}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                                Box {client.box_number}
                            </span>
                        </div>
                        <div className="mb-3 border-t border-b border-gray-50 py-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Deuda Total:</span>
                                <span className={`text-lg font-bold ${client.current_debt > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                    ${client.current_debt.toLocaleString()}
                                </span>
                            </div>
                            {client.credit_balance > 0 && (
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">Saldo a favor:</span>
                                    <span className="text-sm font-bold text-green-600">
                                        ${client.credit_balance.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedClient(client)}
                                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Edit2 size={16} /> Gestionar Pagos
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingClient(client)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteClient(client)}
                                    disabled={deletingId === client.id}
                                    className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 size={16} /> {deletingId === client.id ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredClients.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                        {listMsg || 'No se encontraron clientes'}
                    </div>
                )}
            </div>

            {/* MODAL DE GESTIÓN DE PAGOS */}
            {selectedClient && (
                <ClientDetailModal
                    client={selectedClient}
                    secret={secret}
                    onClose={() => {
                        setSelectedClient(null);
                        fetchClients(); // Recargar datos al cerrar
                    }}
                    onRefresh={fetchClients}
                />
            )}

            {/* MODAL CREAR CLIENTE */}
            {showCreate && (
                <CreateClientModal
                    secret={secret}
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        fetchClients();
                    }}
                />
            )}

            {/* MODAL EDITAR CLIENTE */}
            {editingClient && (
                <EditClientModal
                    secret={secret}
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onUpdated={() => {
                        setEditingClient(null);
                        fetchClients();
                    }}
                />
            )}
        </div>
    );
}

// ==========================================
// COMPONENTE MODAL: GESTIÓN AVANZADA DE CUOTAS
// ==========================================
function ClientDetailModal({ client, secret, onClose, onRefresh }: { client: Client, secret: string, onClose: () => void, onRefresh: () => void }) {
    const [showCreateTx, setShowCreateTx] = useState(false);
    const [showCreateCharge, setShowCreateCharge] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 sticky top-0 z-10">
                    <div className="pr-8">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 break-words">{client.name}</h2>
                        <p className="text-xs md:text-sm text-gray-500">Box: {client.box_number} | Tel: {client.phone}</p>
                    </div>
                    {client.credit_balance > 0 && (
                        <div className="mt-2 sm:mt-0 sm:pr-8">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm font-bold border border-green-200 inline-block">
                                Saldo a favor: ${client.credit_balance.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 p-2 hover:bg-gray-200 bg-gray-100/80 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-bold text-gray-700 text-sm md:text-base">Historial de Cuotas</h3>
                        <div className="flex gap-2">
                            {client.charges.some(c => c.status === 'PENDING' || c.status === 'PARTIAL') && (
                                <button
                                    onClick={() => setShowCreateTx(true)}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">Abonar Saldo</span><span className="sm:hidden">Abonar</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowCreateCharge(true)}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition flex items-center gap-1"
                            >
                                <Plus size={16} /> <span className="hidden sm:inline">Generar Cuota Adelantada</span><span className="sm:hidden">Adelantar</span>
                            </button>
                        </div>
                    </div>

                    {[...client.charges].sort((a, b) => new Date(b.month_period).getTime() - new Date(a.month_period).getTime()).map((charge) => (
                        <ChargeRow
                            key={charge.id}
                            charge={charge}
                            secret={secret}
                            onRefresh={onRefresh}
                        />
                    ))}

                    {client.charges.length === 0 && <p className="text-gray-400 italic text-sm md:text-base">Este cliente no tiene historial de cuotas.</p>}
                </div>

                {showCreateTx && (
                    <CreateTransactionModal
                        clientId={client.id}
                        secret={secret}
                        onClose={() => setShowCreateTx(false)}
                        onCreated={() => {
                            setShowCreateTx(false);
                            onRefresh();
                        }}
                    />
                )}

                {showCreateCharge && (
                    <CreateManualChargeModal
                        clientId={client.id}
                        secret={secret}
                        onClose={() => setShowCreateCharge(false)}
                        onCreated={() => {
                            setShowCreateCharge(false);
                            onRefresh();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function ChargeRow({ charge, secret, onRefresh }: { charge: Charge, secret: string, onRefresh: () => void }) {
    const handleDeleteTx = async (txId: string) => {
        if (!window.confirm('¿Eliminar esta transacción? Esto revertirá el saldo y el estado de la cuota.')) return;
        try {
            const res = await fetch(`${API_URL}/admin/transactions/${txId}`, {
                method: 'DELETE',
                headers: { 'x-admin-secret': secret }
            });
            if (res.ok) onRefresh();
            else {
                const text = await res.text();
                alert(text || 'Error al eliminar la transacción');
            }
        } catch { alert('Error de red'); }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
                <div>
                    <span className="font-bold text-gray-800 capitalize mr-2">{charge.month_period}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${charge.status === 'PAID' ? 'bg-green-100 text-green-700' : charge.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {charge.status === 'PAID' ? 'PAGADO' : charge.status === 'PARTIAL' ? 'PARCIAL' : 'PENDIENTE'}
                    </span>
                </div>
                <div className="flex flex-row justify-between items-center w-full sm:w-auto gap-3">
                    <span className="font-bold text-lg text-gray-800">${charge.total_amount.toLocaleString()}</span>
                </div>
            </div>

            {charge.transactions.length > 0 && (
                <div className="mt-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Transacciones registradas:</h4>
                    {charge.transactions.map(tx => (
                        <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b last:border-0 border-gray-50 text-sm">
                            <div className="flex flex-row items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                                <span className="text-gray-600 font-medium">{new Date(tx.payment_date).toLocaleDateString('es-AR')}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-medium">{tx.method === 'TRANSFER' ? 'Transferencia' : 'Efectivo'}</span>
                            </div>
                            <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                <span className="font-bold text-green-600">+${tx.amount_paid.toLocaleString()}</span>
                                <button onClick={() => handleDeleteTx(tx.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded transition" title="Eliminar Transacción"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Modal para crear un nuevo cliente
function CreateClientModal({ secret, onClose, onCreated }: { secret: string, onClose: () => void, onCreated: () => void }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [boxNumber, setBoxNumber] = useState<number | ''>('');
    const [status, setStatus] = useState<'ACTIVE' | 'DEBTOR'>('ACTIVE');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (!name.trim() || !phone.trim() || boxNumber === '' || Number(boxNumber) <= 0) {
            setError('Completa nombre, teléfono y un box válido (>0)');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    box_number: Number(boxNumber),
                    status
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo crear el cliente');
                setSaving(false);
                return;
            }
            onCreated();
        } catch {
            setError('Error de red al crear cliente');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-4">
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">Nuevo Cliente</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Teléfono</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Box</label>
                            <input
                                type="number"
                                value={boxNumber}
                                onChange={e => setBoxNumber(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Estado</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as 'ACTIVE' | 'DEBTOR')}
                                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            >
                                <option value="ACTIVE">Activo</option>
                                <option value="DEBTOR">Deudor</option>
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-xs md:text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={onClose} className="px-3 py-2 border rounded text-sm md:text-base">Cancelar</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50 text-sm md:text-base"
                        >
                            {saving ? 'Guardando...' : 'Crear'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal para editar un cliente existente
function EditClientModal({ secret, client, onClose, onUpdated }: { secret: string, client: Client, onClose: () => void, onUpdated: () => void }) {
    const [name, setName] = useState(client.name);
    const [phone, setPhone] = useState(client.phone);
    const [boxNumber, setBoxNumber] = useState<number | ''>(client.box_number);
    const [status, setStatus] = useState<'ACTIVE' | 'DEBTOR'>(client.status);
    const [isActive, setIsActive] = useState(client.is_active);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (!name.trim() || !phone.trim() || boxNumber === '' || Number(boxNumber) <= 0) {
            setError('Completa nombre, teléfono y un box válido (>0)');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/clients/${client.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    box_number: Number(boxNumber),
                    status,
                    is_active: isActive
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo actualizar el cliente');
                setSaving(false);
                return;
            }
            onUpdated();
        } catch {
            setError('Error de red al actualizar cliente');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-4">
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">Editar Cliente</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Nombre</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base" />
                    </div>
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Teléfono</label>
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Box</label>
                            <input type="number" value={boxNumber} onChange={e => setBoxNumber(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded text-sm md:text-base" min={1} />
                        </div>
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Estado de Pago</label>
                            <select value={status} onChange={e => setStatus(e.target.value as 'ACTIVE' | 'DEBTOR')} className="w-full px-3 py-2 border rounded text-sm md:text-base">
                                <option value="ACTIVE">Al Día</option>
                                <option value="DEBTOR">Deudor</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-2 bg-gray-50 p-2 rounded border border-gray-200 select-none">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                            Cliente Activo en el Sistema
                        </label>
                    </div>
                    {error && <p className="text-xs md:text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={onClose} className="px-3 py-2 border rounded text-sm md:text-base hover:bg-gray-50">Cancelar</button>
                        <button onClick={handleSave} disabled={saving} className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50 text-sm md:text-base hover:bg-blue-700">
                            {saving ? 'Guardando...' : 'Actualizar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getNextMonthsOptions() {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const monthName = d.toLocaleString('es-ES', { month: 'long' });
        options.push({
            value: `${year}-${month}-01`,
            label: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
        });
    }
    return options;
}

// Modal para generar cuota manual/adelantada
function CreateManualChargeModal({ clientId, secret, onClose, onCreated }: { clientId: string, secret: string, onClose: () => void, onCreated: () => void }) {
    const [amount, setAmount] = useState<number | ''>('');
    const [monthOptions] = useState(() => getNextMonthsOptions());
    const [monthPeriod, setMonthPeriod] = useState<string>(() => monthOptions.length > 0 ? monthOptions[0].value : '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        fetch(`${API_URL}/admin/fee`, { headers: { 'x-admin-secret': secret } })
            .then(res => res.json())
            .then(data => { if (isMounted) setAmount(Number(data.value)); })
            .catch(() => { if (isMounted) setAmount(100); }); // default fallback
        return () => { isMounted = false; };
    }, [secret]);

    const handleSave = async () => {
        setError('');
        if (amount === '' || Number(amount) <= 0 || !monthPeriod) {
            setError('Ingresa un monto positivo y selecciona el mes');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/charges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    client_id: clientId,
                    total_amount: Number(amount),
                    month_period: monthPeriod
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.detail || 'No se pudo generar la cuota. Revisa si ya existe una para este mes.');
                setSaving(false);
                return;
            }
            onCreated();
        } catch {
            setError('Error de red al registrar la cuota');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm my-4">
                <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base">Generar Cuota Adelantada</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Mes a cobrar</label>
                        <select
                            value={monthPeriod}
                            onChange={e => setMonthPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {monthOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Monto de la Cuota ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:ring-2 focus:ring-blue-500"
                            min={1}
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                        <button onClick={onClose} className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-green-700 transition"
                        >
                            {saving ? 'Generando...' : 'Crear Cuota'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal para crear Transacción manual
function CreateTransactionModal({ clientId, secret, onClose, onCreated }: { clientId: string, secret: string, onClose: () => void, onCreated: () => void }) {
    const [amount, setAmount] = useState<number | ''>('');
    const [method, setMethod] = useState<string>('TRANSFER');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (amount === '' || Number(amount) <= 0 || !method) {
            setError('Ingresa un monto positivo y un método de pago');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/clients/${clientId}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    amount_paid: Number(amount),
                    method
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo registrar la transacción');
                setSaving(false);
                return;
            }
            onCreated();
        } catch {
            setError('Error de red al registrar transacción');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm my-4">
                <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base">Registrar Abono</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Monto Abonado ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:ring-2 focus:ring-blue-500"
                            min={1}
                            placeholder="Ej. 50000"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">Método de Pago</label>
                        <select
                            value={method}
                            onChange={e => setMethod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="TRANSFER">Transferencia / Billetera Virtual</option>
                            <option value="CASH">Efectivo</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                        <button onClick={onClose} className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancelar</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
                        >
                            {saving ? 'Registrando...' : 'Confirmar Abono'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal para crear una nueva entrada en lista de espera
function CreateWaitlistModal({ secret, onClose, onCreated }: { secret: string, onClose: () => void, onCreated: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [boxSize, setBoxSize] = useState('');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (!name.trim() || !phone.trim() || !boxSize.trim() || !email.trim()) {
            setError('Completa nombre, email, teléfono y tamaño de box');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/waiting-list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    box_type: boxSize.trim(),
                    message: message.trim()
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo crear la entrada');
                setSaving(false);
                return;
            }
            onCreated();
        } catch {
            setError('Error de red al crear entrada');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-4">
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">Nueva Entrada a Espera</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Nombre</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Teléfono</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Box Solicitado</label>
                            <input type="text" value={boxSize} onChange={e => setBoxSize(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. L, M, S" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Mensaje (opcional)</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
                    </div>
                    {error && <p className="text-xs md:text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={onClose} className="px-3 py-2 border rounded text-sm md:text-base hover:bg-gray-50 transition">Cancelar</button>
                        <button onClick={handleSave} disabled={saving} className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50 text-sm md:text-base hover:bg-green-700 transition">
                            {saving ? 'Guardando...' : 'Crear'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VISTA 3: LISTA DE ESPERA (WAITLIST)
// ==========================================
function WaitlistView({ secret }: { secret: string }) {
    const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [listMsg, setListMsg] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
        const [showCreate, setShowCreate] = useState(false);

    const fetchWaitlist = async () => {
        setLoading(true);
        try {
            if (!API_URL) {
                setWaitlist([]);
                setListMsg('Error: API_URL no configurada');
                setLoading(false);
                return;
            }

            const url = `${API_URL}/admin/waiting-list`;

            const res = await fetch(url, {
                headers: { 'x-admin-secret': secret }
            });


            if (!res.ok) {
                const errorText = await res.text();
                setWaitlist([]);
                setListMsg(`Error al cargar: ${res.status} - ${errorText || 'Error desconocido'}`);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setWaitlist(Array.isArray(data) ? data : []);
            setListMsg(Array.isArray(data) && data.length === 0 ? 'No hay personas en la lista de espera' : '');
        } catch {
            setWaitlist([]);
            setListMsg('Error de red');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWaitlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secret]);

    // Filtrado simple frontend por nombre o email
    const filteredWaitlist = waitlist.filter(entry =>
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteEntry = async (entry: WaitlistEntry) => {
        const ok = window.confirm(`¿Eliminar a ${entry.name} de la lista de espera?`);
        if (!ok) return;
        setDeletingId(entry.id);
        try {
            const res = await fetch(`${API_URL}/admin/waiting-list/${entry.id}`, {
                method: 'DELETE',
                headers: { 'x-admin-secret': secret }
            });
            if (!res.ok) {
                const text = await res.text();
                alert(text || 'No se pudo eliminar el registro');
                setDeletingId(null);
                return;
            }
            fetchWaitlist();
        } catch {
            alert('Error de red al procesar acción');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const buildWaitlistWhatsAppLink = (entry: WaitlistEntry) => {
        const message = `Hola ${entry.name.split(" ")[0]} 👋, buen día.\nTe escribo de Guardería La Chueca 🚤. \nTe contactamos porque se nos ha liberado un box tamaño ${entry.box_size} y vimos que estabas en nuestra lista de espera.\nSi seguís interesado/a, confirmame por este medio así coordinamos. ¡Saludos!`;
        return `https://wa.me/${entry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div>
            {/* Barra de Herramientas */}
            <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <div className="relative flex-1 sm:flex-initial sm:w-64 md:w-72">
                    <Search className="absolute left-3 top-2.5 md:top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filtrar por nombre o email"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 md:pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={fetchWaitlist}
                        disabled={loading}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 text-sm md:text-base transition"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refrescar
                    </button>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 text-sm md:text-base shadow-sm transition"
                    >
                        <Plus size={18} /> Nuevo Registro
                    </button>
                </div>
            </div>

            {/* Tabla de Espera - Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Teléfono</th>
                            <th className="px-6 py-4">Box Solicitado</th>
                            <th className="px-6 py-4">Mensaje</th>
                            <th className="px-6 py-4">Fecha Registro</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredWaitlist.map(entry => (
                            <tr key={entry.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{entry.name}</td>
                                <td className="px-6 py-4 text-gray-600">{entry.email}</td>
                                <td className="px-6 py-4 text-gray-600">{entry.phone}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                                        {entry.box_size}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={entry.message || 'Sin mensaje'}>
                                    {entry.message || '-'}
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">
                                    {formatDate(entry.created_at)}
                                </td>
                                <td className="px-6 py-4 flex justify-center gap-3">
                                    <a
                                        href={buildWaitlistWhatsAppLink(entry)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 transition-colors"
                                        title="Avisar disponibilidad por WhatsApp"
                                    >
                                        <MessageCircle size={16} /> Avisar
                                    </a>
                                    <button
                                        onClick={() => handleDeleteEntry(entry)}
                                        disabled={deletingId === entry.id}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                                        title="Eliminar de lista de espera"
                                    >
                                        <Trash2 size={16} /> {deletingId === entry.id ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredWaitlist.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                    {listMsg || 'No se encontraron registros'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tarjetas de Espera - Mobile */}
            <div className="md:hidden space-y-3">
                {filteredWaitlist.map(entry => (
                    <div key={entry.id} className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-base mb-1">{entry.name}</h3>
                                <p className="text-xs text-gray-500 break-all">{entry.email}</p>
                            </div>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold ml-2 whitespace-nowrap">
                                {entry.box_size}
                            </span>
                        </div>

                        <div className="space-y-2 mb-3 text-sm">
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium flex-shrink-0">Tel:</span>
                                <span className="text-gray-700">{entry.phone}</span>
                            </div>
                            {entry.message && (
                                <div className="flex items-start gap-2">
                                    <span className="text-gray-500 font-medium flex-shrink-0">Msg:</span>
                                    <span className="text-gray-700">{entry.message}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium flex-shrink-0">Fecha:</span>
                                <span className="text-gray-700 text-xs">{formatDate(entry.created_at)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <a
                                href={buildWaitlistWhatsAppLink(entry)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-green-50 text-green-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle size={16} /> Avisar
                            </a>
                            <button
                                onClick={() => handleDeleteEntry(entry)}
                                disabled={deletingId === entry.id}
                                className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={16} /> {deletingId === entry.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                ))}
                {filteredWaitlist.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                        {listMsg || 'No se encontraron registros'}
                    </div>
                )}
            </div>

            {showCreate && (
                <CreateWaitlistModal
                    secret={secret}
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        fetchWaitlist();
                    }}
                />
            )}
        </div>
    );
}

// --- DASHBOARD VIEW ---
function DashboardView({ secret }: { secret: string }) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState<'current_month' | 'last_year'>('current_month');
    const [historyMonths, setHistoryMonths] = useState<6 | 12>(6);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/dashboard-stats`, {
                    headers: { 'x-admin-secret': secret }
                });
                if (!res.ok) throw new Error('Error al cargar métricas');
                const data = await res.json();
                setStats(data);
            } catch {
                setError('No se pudieron cargar las métricas');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [secret]);

    if (loading) return <div className="text-center py-10">Cargando métricas...</div>;
    if (error || !stats) return <div className="text-center py-10 text-red-500">{error}</div>;

    const formatMoney = (val: number) => `$${val.toLocaleString('es-AR')}`;

    const activeStats = timeRange === 'current_month' ? stats.current_month : stats.last_year;
    const titleText = timeRange === 'current_month' ? 'Mes Actual' : 'Últimos 12 Meses';

    const percentPaid = activeStats.invoiced > 0
        ? ((activeStats.paid / activeStats.invoiced) * 100).toFixed(1)
        : '0.0';

    const buildDebtorWhatsAppLink = (debtor: { name: string, phone: string }) => {
        const message = `Hola ${debtor.name.split(" ")[0]} 👋, buen día.\nTe escribo para recordarte que el 10 vence el plazo para abonar tu cuota de la guarderia con descuento 🚤. \nPodés ver tu saldo actualizado, los datos de la cuenta y planes de pago en el siguiente link:\n🔗https://guarderialachueca.com/status/${debtor.phone} \n👉Importante:\n- En caso de transferir enviá el comprobante por este chat.\n- Si pagás en efectivo, escribime para coordinar.`;
        return `https://wa.me/${debtor.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    const buildDashboardWaitlistWhatsAppLink = (candidate: { name: string, phone: string, box_size: string }) => {
        const message = `Hola ${candidate.name.split(" ")[0]} 👋, buen día.\nTe escribo de Guardería La Chueca 🚤. \nTe contactamos porque se nos ha liberado un box tamaño ${candidate.box_size} y vimos que estabas en nuestra lista de espera.\nSi seguís interesado/a, confirmame por este medio así coordinamos. ¡Saludos!`;
        return `https://wa.me/${candidate.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Resumen Financiero ({titleText})</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setTimeRange('current_month')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeRange === 'current_month' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Mes Actual
                    </button>
                    <button
                        onClick={() => setTimeRange('last_year')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeRange === 'last_year' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Último Año
                    </button>
                </div>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                        <DollarSign size={100} />
                    </div>
                    <p className="text-gray-400 font-medium mb-1">Total Facturado</p>
                    <h3 className="text-3xl font-bold">{formatMoney(activeStats.invoiced)}</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 shadow-lg border border-blue-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10">
                        <TrendingUp size={100} />
                    </div>
                    <p className="text-blue-200 font-medium mb-1">
                        Total Recaudado
                        <span className="ml-2 text-xs font-bold bg-blue-700 text-blue-100 px-2 py-0.5 rounded-full">{percentPaid}%</span>
                    </p>
                    <h3 className="text-3xl font-bold">{formatMoney(activeStats.paid)}</h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <p className="text-gray-500 font-medium">En Efectivo</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatMoney(activeStats.cash)}</h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <CreditCard size={20} />
                        </div>
                        <p className="text-gray-500 font-medium">Por Transferencia</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatMoney(activeStats.transfer)}</h3>
                </div>
            </div>

            {/* Métricas Operativas y Capacidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* Ocupación Actual */}
                <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-gray-800 font-bold">
                            <Home className="text-blue-600" size={20} />
                            Ocupación Actual
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.occupancy.occupancy_rate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${stats.occupancy.occupancy_rate}%` }}></div>
                    </div>
                </div>

                {/* Boxes Disponibles */}
                <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <p className="text-gray-500 font-medium">Boxes Disponibles</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {stats.occupancy.available_boxes} <span className="text-sm font-medium text-gray-500">/ {stats.occupancy.total_rentable_boxes}</span>
                    </h3>
                </div>

                {/* Potencial Mensual */}
                <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Target size={20} />
                        </div>
                        <p className="text-gray-500 font-medium">Potencial Mensual</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-gray-900">{formatMoney(stats.occupancy.potential_revenue)}</h3>
                    </div>
                </div>

                {/* Demanda / Lista de Espera */}
                <div className="bg-white rounded-xl p-6 shadow border border-gray-200 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <ListOrdered size={20} />
                        </div>
                        <p className="text-gray-500 font-medium">Lista de Espera</p>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">{stats.occupancy.waitlist_count} <span className="text-sm font-medium text-gray-500">personas</span></h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stats.occupancy.waitlist_count >= stats.occupancy.available_boxes && stats.occupancy.available_boxes > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {stats.occupancy.waitlist_count >= stats.occupancy.available_boxes && stats.occupancy.available_boxes > 0 ? 'Demanda Cubierta' : 'En Espera'}
                        </span>
                    </div>
                    {stats.occupancy.available_boxes > 0 && stats.occupancy.top_waitlist?.length > 0 && (
                        <div className="mt-auto pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium mb-2">Contactar próximos candidatos:</p>
                            <div className="space-y-2">
                                {stats.occupancy.top_waitlist.map((candidate, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <div className="truncate pr-2">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{candidate.name}</p>
                                            <p className="text-xs text-gray-500">Box: {candidate.box_size}</p>
                                        </div>
                                        <a
                                            href={buildDashboardWaitlistWhatsAppLink(candidate)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex-shrink-0"
                                            title="Avisar por WhatsApp"
                                        >
                                            <MessageCircle size={16} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gráficos y Deudores */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Gráfico */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="text-blue-600" />
                            Evolución de Ingresos
                        </h3>
                        <select
                            value={historyMonths}
                            onChange={(e) => setHistoryMonths(Number(e.target.value) as 6 | 12)}
                            className="text-sm border border-gray-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={6}>Últimos 6 meses</option>
                            <option value={12}>Últimos 12 meses</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.history.slice(-historyMonths)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    formatter={(value) => [formatMoney(Number(value) || 0), 'Recaudación']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40}>
                                    {stats.history.slice(-historyMonths).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === historyMonths - 1 ? '#2563EB' : '#93C5FD'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Deudores */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" />
                            Top Deudores
                        </h3>
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Deuda Total: {formatMoney(stats.total_debt)}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {stats.top_debtors.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No hay clientes con deudas activas.</p>
                        ) : (
                            stats.top_debtors.map((debtor, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                                    <div>
                                        <p className="font-semibold text-gray-800">{debtor.name}</p>
                                        <p className="text-xs text-gray-500">{debtor.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-red-600">{formatMoney(debtor.debt)}</span>
                                        <a
                                            href={buildDebtorWhatsAppLink(debtor)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                                            title="Enviar WhatsApp"
                                        >
                                            <MessageCircle size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
