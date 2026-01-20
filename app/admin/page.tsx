'use client';

import { useState, useEffect } from 'react';
import {
    Lock, Settings, Users, Search, Plus,
    Trash2, Edit2, Check, X, DollarSign, Save, Clock, RefreshCw
} from 'lucide-react';

// --- TIPOS (Types) ---
type Payment = {
    id: string;
    amount: number;
    month_period: string;
    status: 'PENDING' | 'PAID';
    method: string | null;
};

type Client = {
    id: string;
    name: string;
    phone: string;
    box_number: number;
    status: 'ACTIVE' | 'DEBTOR';
    payments: Payment[];
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
    // --- ESTADOS GLOBALES ---
    const [secret, setSecret] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'clients' | 'settings' | 'waitlist'>('clients');
    const [loading, setLoading] = useState(false);
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

            if (res.status === 403) {
                setLoginError('Contraseña inválida');
                setIsAuthenticated(false);
                return;
            }

            setIsAuthenticated(true);
        } catch (err) {
            setLoginError('No se pudo verificar, revisa la conexión');
        }
    };

    // Renderizado Condicional
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                    <div className="flex justify-center mb-4 text-blue-600">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Panel Administrador</h2>
                    <input
                        type="password"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Ingresa tu Contraseña"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                    />
                    {loginError && <p className="text-sm text-red-600 mb-3 text-center">{loginError}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                        Ingresar
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Admin */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-lg md:text-xl text-gray-800">
                    <span>🛡️ Panel Administrador</span>
                </div>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Cerrar Sesión
                </button>
            </header>

            {/* Tabs de Navegación */}
            <div className="flex justify-center bg-white border-b border-gray-200 overflow-x-auto">
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

            {/* Contenido Principal */}
            <main className="flex-1 container mx-auto p-4 md:p-6">
                {activeTab === 'settings' && <SettingsView secret={secret} />}
                {activeTab === 'clients' && <ClientsView secret={secret} />}
                {activeTab === 'waitlist' && <WaitlistView secret={secret} />}
            </main>
        </div>
    );
}

// ==========================================
// VISTA 1: CONFIGURACIÓN (PRECIO)
// ==========================================
function SettingsView({ secret }: { secret: string }) {
    const [fee, setFee] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [generatingDebt, setGeneratingDebt] = useState(false);
    const [debtMsg, setDebtMsg] = useState('');
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
                    setFee('');
                    setMsg('Configura el valor por primera vez');
                    return;
                }

                if (!res.ok) {
                    setError('No se pudo cargar el valor');
                    return;
                }

                const data = await res.json();
                if (data?.value) setFee(data.value);
            } catch (err) {
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
            } catch (err) {
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
            const parsed = parseFloat(fee);
            if (!Number.isFinite(parsed) || parsed <= 0) {
                setError('Ingresa un valor numérico mayor a 0');
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/admin/settings/fee`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({ fee: parsed })
            });
            if (res.ok) {
                const data = await res.json();
                setMsg(`✅ Precio actualizado correctamente. ${data.payments_updated || 0} pagos pendientes recalculados.`);
            }
            else setMsg('❌ Error al actualizar');
        } catch (e) {
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
        } catch (e) {
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
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Precio Actual ($)</label>
                        <input
                            type="number"
                            value={fee}
                            onChange={e => setFee(e.target.value)}
                            className="w-full px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base"
                        />
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

            {/* Sección de Generar Deudas Mensuales - Mes Actual */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                    <DollarSign className="text-orange-600" size={20} />
                    Generar Deudas del Mes Actual
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    Crea automáticamente las cuotas del mes actual para todos los clientes activos.
                </p>

                <button
                    onClick={() => handleGenerateDebt(false)}
                    disabled={generatingDebt}
                    className="w-full bg-orange-600 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm md:text-base"
                >
                    {generatingDebt ? 'Generando...' : 'Generar Cuotas del Mes Actual'}
                </button>
                {debtMsg && <p className="text-center text-xs md:text-sm font-medium mt-3 animate-pulse">{debtMsg}</p>}
            </div>

            {/* Sección de Generar Deudas Mensuales - Mes Siguiente */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                    <DollarSign className="text-orange-600" size={20} />
                    Generar Deudas del Mes Siguiente
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    Crea automáticamente las cuotas del próximo mes para todos los clientes activos.
                </p>

                <button
                    onClick={() => handleGenerateDebt(true)}
                    disabled={generatingDebt}
                    className="w-full bg-orange-600 text-white font-bold py-2 md:py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm md:text-base"
                >
                    {generatingDebt ? 'Generando...' : 'Generar Cuotas del Mes Siguiente'}
                </button>
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
    const [listMsg, setListMsg] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null); // Para el Modal
    const [showCreate, setShowCreate] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const fetchClients = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/clients`, {
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
        } catch (e) {
            setClients([]);
            setListMsg('Error de red al cargar clientes');
        }
    };

    useEffect(() => {
        fetchClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secret]);

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
        } catch (e) {
            alert('Error de red al eliminar');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {/* Barra de Herramientas */}
            <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row gap-2 md:w-auto w-full">
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
                    <button
                        onClick={fetchClients}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 text-sm md:text-base"
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
                            <tr key={client.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium">{client.name}</td>
                                <td className="px-6 py-4 text-gray-500">{client.phone}</td>
                                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{client.box_number}</span></td>
                                <td className={`px-6 py-4 font-bold ${client.current_debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${client.current_debt.toLocaleString()}
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
                    <div key={client.id} className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-base">{client.name}</h3>
                                <p className="text-sm text-gray-500">{client.phone}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                                Box {client.box_number}
                            </span>
                        </div>
                        <div className="mb-3">
                            <span className="text-xs text-gray-500">Deuda Total:</span>
                            <span className={`ml-2 text-lg font-bold ${client.current_debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${client.current_debt.toLocaleString()}
                            </span>
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
// COMPONENTE MODAL: GESTIÓN AVANZADA DE PAGOS
// ==========================================
function ClientDetailModal({ client, secret, onClose, onRefresh }: { client: Client, secret: string, onClose: () => void, onRefresh: () => void }) {

    // Función para editar un pago individual (Parcial o Total)
    const handleUpdatePayment = async (paymentId: string, newAmount: number, newStatus: string, newMethod: string | null) => {
        try {
            const res = await fetch(`${API_URL}/admin/payments/${paymentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    amount: newAmount,
                    status: newStatus,
                    method: newMethod || null
                })
            });
            if (res.ok) {
                alert("Pago actualizado correctamente");
                onRefresh();
            } else {
                alert("Error al actualizar");
            }
        } catch (e) {
            alert("Error de red");
        }
    };

    const handleDeletePayment = async (paymentId: string) => {
        const ok = window.confirm('¿Eliminar este pago?');
        if (!ok) return;
        try {
            const res = await fetch(`${API_URL}/admin/payments/${paymentId}`, {
                method: 'DELETE',
                headers: { 'x-admin-secret': secret }
            });
            if (!res.ok) {
                const text = await res.text();
                alert(text || 'No se pudo eliminar el pago');
                return;
            }
            onRefresh();
        } catch (e) {
            alert('Error de red al eliminar pago');
        }
    };

    const handleCreatePayment = async (payload: { amount: number; status: string; method?: string | null; month_period: string; client_id: string; }) => {
        try {
            const res = await fetch(`${API_URL}/admin/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const text = await res.text();
                alert(text || 'No se pudo crear el pago');
                return false;
            }
            onRefresh();
            return true;
        } catch (e) {
            alert('Error de red al crear pago');
            return false;
        }
    };

    const [showCreatePayment, setShowCreatePayment] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
                {/* Modal Header */}
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 sticky top-0">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-800">{client.name}</h2>
                        <p className="text-xs md:text-sm text-gray-500">Box: {client.box_number} | Tel: {client.phone}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Pagos */}
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 gap-2 sm:gap-0">
                        <h3 className="font-bold text-gray-700 text-sm md:text-base">Historial de Cuotas</h3>
                        <button
                            onClick={() => setShowCreatePayment(true)}
                            className="text-xs md:text-sm bg-green-600 text-white px-3 py-1.5 md:py-1 rounded hover:bg-green-700"
                        >
                            Agregar pago
                        </button>
                    </div>

                    {client.payments.map((payment) => (
                        <PaymentRow
                            key={payment.id}
                            payment={payment}
                            onSave={handleUpdatePayment}
                            onDelete={handleDeletePayment}
                        />
                    ))}

                    {client.payments.length === 0 && <p className="text-gray-400 italic text-sm md:text-base">Este cliente no tiene historial de pagos.</p>}
                </div>
                {/* MODAL CREAR PAGO */}
                {showCreatePayment && (
                    <CreatePaymentModal
                        clientId={client.id}
                        secret={secret}
                        onClose={() => setShowCreatePayment(false)}
                        onCreated={() => {
                            setShowCreatePayment(false);
                            onRefresh();
                        }}
                    />
                )}
            </div>
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
        } catch (e) {
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

// Sub-componente para editar cada fila de pago
function PaymentRow({ payment, onSave, onDelete }: { payment: Payment, onSave: (id: string, am: number, st: string, method: string | null) => void, onDelete: (id: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editAmount, setEditAmount] = useState(payment.amount);
    const [editStatus, setEditStatus] = useState(payment.status);
    const [editMethod, setEditMethod] = useState(payment.method || '');

    if (isEditing) {
        return (
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Monto ($)</label>
                        <input
                            type="number"
                            value={editAmount}
                            onChange={e => setEditAmount(Number(e.target.value))}
                            className="w-full px-2 py-1.5 border rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Estado</label>
                        <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as any)}
                            className="w-full px-2 py-1.5 border rounded text-sm"
                        >
                            <option value="PENDING">Pendiente</option>
                            <option value="PAID">Pagado</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Método</label>
                        <select
                            value={editMethod}
                            onChange={e => setEditMethod(e.target.value)}
                            className="w-full px-2 py-1.5 border rounded text-sm"
                        >
                            <option value="">Sin registrar</option>
                            <option value="CASH">Efectivo</option>
                            <option value="TRANSFER">Transferencia</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => onSave(payment.id, editAmount, editStatus, editMethod || null)}
                        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        title="Guardar"
                    >
                        <Save size={16} />
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                        title="Cancelar"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex-1">
                <p className="font-bold text-gray-800 capitalize text-sm md:text-base">{payment.month_period}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {payment.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                    </span>
                    {payment.method && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-medium">
                            {payment.method === 'TRANSFER' ? 'Transferencia' : 'Efectivo'}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-mono font-bold text-base md:text-lg">${payment.amount.toLocaleString()}</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"
                        title="Editar Saldo/Estado"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(payment.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                        title="Eliminar pago"
                    >
                        <Trash2 size={18} />
                    </button>
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
                    status
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo actualizar el cliente');
                setSaving(false);
                return;
            }
            onUpdated();
        } catch (e) {
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
                            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50 text-sm md:text-base"
                        >
                            {saving ? 'Guardando...' : 'Actualizar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modal para crear pago manual
function CreatePaymentModal({ clientId, secret, onClose, onCreated }: { clientId: string, secret: string, onClose: () => void, onCreated: () => void }) {
    const [amount, setAmount] = useState<number | ''>('');
    const [monthPeriod, setMonthPeriod] = useState('');
    const [status, setStatus] = useState<'PENDING' | 'PAID'>('PENDING');
    const [method, setMethod] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setError('');
        if (amount === '' || Number(amount) <= 0 || !monthPeriod) {
            setError('Ingresa un monto > 0 y una fecha (YYYY-MM-DD)');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/admin/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
                body: JSON.stringify({
                    client_id: clientId,
                    amount: Number(amount),
                    month_period: monthPeriod,
                    status,
                    method: method || null
                })
            });
            if (!res.ok) {
                const text = await res.text();
                setError(text || 'No se pudo crear el pago');
                setSaving(false);
                return;
            }
            onCreated();
        } catch (e) {
            setError('Error de red al crear pago');
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-4">
                <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg">Crear Pago</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Monto ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="text-xs md:text-sm text-gray-600 block mb-1">Periodo (YYYY-MM-DD)</label>
                        <input
                            type="date"
                            value={monthPeriod}
                            onChange={e => setMonthPeriod(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Estado</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as 'PENDING' | 'PAID')}
                                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            >
                                <option value="PENDING">Pendiente</option>
                                <option value="PAID">Pagado</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs md:text-sm text-gray-600 block mb-1">Método</label>
                            <select
                                value={method}
                                onChange={e => setMethod(e.target.value)}
                                className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            >
                                <option value="">Sin registrar</option>
                                <option value="CASH">Efectivo</option>
                                <option value="TRANSFER">Transferencia</option>
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
                            {saving ? 'Guardando...' : 'Crear pago'}
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
    const [search, setSearch] = useState('');
    const [listMsg, setListMsg] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            console.log('Fetching waitlist from:', url);

            const res = await fetch(url, {
                headers: { 'x-admin-secret': secret }
            });

            console.log('Response status:', res.status);

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error response:', errorText);
                setWaitlist([]);
                setListMsg(`Error al cargar: ${res.status} - ${errorText || 'Error desconocido'}`);
                setLoading(false);
                return;
            }

            const data = await res.json();
            console.log('Waitlist data:', data);
            setWaitlist(Array.isArray(data) ? data : []);
            setListMsg(Array.isArray(data) && data.length === 0 ? 'No hay personas en la lista de espera' : '');
        } catch (e) {
            console.error('Fetch error:', e);
            setWaitlist([]);
            setListMsg(`Error: ${e instanceof Error ? e.message : 'Error de red'}`);
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
            await fetchWaitlist();
        } catch (e) {
            alert('Error de red al eliminar');
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
                <button
                    onClick={fetchWaitlist}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refrescar
                </button>
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
                                <td className="px-6 py-4 flex justify-center">
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

                        <button
                            onClick={() => handleDeleteEntry(entry)}
                            disabled={deletingId === entry.id}
                            className="w-full bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Trash2 size={16} /> {deletingId === entry.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                ))}
                {filteredWaitlist.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                        {listMsg || 'No se encontraron registros'}
                    </div>
                )}
            </div>
        </div>
    );
}
