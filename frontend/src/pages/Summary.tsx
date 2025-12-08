import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentsAPI } from '../services/paymentsAPI';
import { layoutAPI } from '../services/layoutAPI';
import { mealsAPI } from '../services/mealsAPI';
import { thermoAPI } from '../services/thermoAPI';
import api, { graduateAPI } from '../services/api';
import ProgressRing from '../components/ProgressRing';

interface SummaryData {
    graduate: {
        full_name: string;
        email: string;
        phone: string;
        career: string;
        generation: string;
    };
    event: {
        name: string;
        date: string;
        venue: string;
    };
    tickets: {
        count: number;
        total_amount: number;
    };
    table: {
        label: string;
        capacity: number;
    } | null;
    guests: Array<{
        full_name: string;
        meal_type: string;
    }>;
    payments: {
        total_amount: number;
        paid_amount: number;
        progress_percent: number;
    };
    thermo: {
        is_unlocked: boolean;
        has_customized: boolean;
        full_text: string;
    };
}

const Summary: React.FC = () => {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        try {
            setLoading(true);

            const profileResp = await api.get('/graduates/me');
            const profile = profileResp.data;
            const eventId = profile.event_id;

            const [paymentsResp, layoutResp, mealsResp, thermoResp, guestsResp] = await Promise.all([
                paymentsAPI.getSummary(),
                layoutAPI.getLayout(eventId),
                mealsAPI.getMeals(),
                thermoAPI.getStatus(),
                graduateAPI.getGuests(),
            ]);

            const payments = paymentsResp.data;
            const layout = layoutResp.data;
            const meals = mealsResp.data;
            const thermo = thermoResp.data;
            const guestsData = guestsResp.data;

            const selectedTable = layout.my_selection
                ? layout.tables?.find((t: any) => t.id === layout.my_selection.table_id)
                : null;

            setData({
                graduate: {
                    full_name: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    career: profile.career,
                    generation: profile.generation,
                },
                event: {
                    name: profile.event?.name || 'Evento',
                    date: profile.event?.date || '',
                    venue: profile.event?.venue || '',
                },
                tickets: {
                    count: guestsData.tickets_count || guestsData.guests?.length || 0,
                    total_amount: payments.total_amount,
                },
                table: selectedTable
                    ? {
                        label: selectedTable.label,
                        capacity: selectedTable.capacity,
                    }
                    : null,
                guests: meals.guests || [],
                payments: {
                    total_amount: payments.total_amount,
                    paid_amount: payments.paid_amount,
                    progress_percent: payments.progress_percent,
                },
                thermo: {
                    is_unlocked: thermo.is_unlocked,
                    has_customized: thermo.has_customized,
                    full_text: thermo.thermo_prefix
                        ? `${thermo.thermo_prefix} ${thermo.thermo_name}`
                        : thermo.thermo_name || 'No personalizado',
                },
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar resumen');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-premium mb-4"></div>
                    <p className="text-premium-silver">Cargando resumen...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center p-4">
                <div className="card-premium max-w-md bg-error/10 border-error/30">
                    <p className="text-error mb-4">{error || 'Error al cargar datos'}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-black pb-24 md:pb-8">
            {/* Header */}
            <header className="bg-gradient-card border-b border-premium-gold/20 sticky top-0 z-40 backdrop-blur-lg">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-premium-silver hover:text-premium-gold transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="font-display text-2xl font-bold text-premium-platinum">
                            Resumen General
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Progress Overview */}
                <div className="card-premium text-center">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-6">
                        Progreso General
                    </h2>
                    <div className="flex justify-center">
                        <ProgressRing progress={data.payments.progress_percent} size={140} strokeWidth={10} />
                    </div>
                </div>

                {/* Personal Info */}
                <div className="card-premium">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                        <span>👤</span> Información Personal
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Nombre Completo</div>
                            <div className="font-semibold text-premium-platinum">{data.graduate.full_name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Carrera</div>
                            <div className="font-semibold text-premium-platinum">{data.graduate.career}</div>
                        </div>
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Email</div>
                            <div className="font-semibold text-premium-platinum text-sm">{data.graduate.email}</div>
                        </div>
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Generación</div>
                            <div className="font-semibold text-premium-platinum">{data.graduate.generation}</div>
                        </div>
                    </div>
                </div>

                {/* Event Info */}
                <div className="card-premium">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                        <span>🎓</span> Evento
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Nombre</div>
                            <div className="font-semibold text-premium-platinum">{data.event.name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Fecha</div>
                            <div className="font-semibold text-premium-platinum">{formatDate(data.event.date)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-premium-silver mb-1">Lugar</div>
                            <div className="font-semibold text-premium-platinum">{data.event.venue}</div>
                        </div>
                    </div>
                </div>

                {/* Tickets & Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-premium">
                        <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                            <span>🎫</span> Boletos
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs text-premium-silver mb-1">Cantidad</div>
                                <div className="text-3xl font-bold text-premium-gold">
                                    {data.tickets.count}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-premium-silver mb-1">Monto Total</div>
                                <div className="font-mono text-lg font-semibold text-premium-platinum">
                                    {formatCurrency(data.tickets.total_amount)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium">
                        <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                            <span>🪑</span> Mesa
                        </h2>
                        {data.table ? (
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs text-premium-silver mb-1">Mesa Seleccionada</div>
                                    <div className="text-3xl font-bold text-premium-gold">
                                        {data.table.label}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-premium-silver mb-1">Capacidad</div>
                                    <div className="text-lg font-semibold text-premium-platinum">
                                        {data.table.capacity} personas
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-premium-silver/50">
                                No has seleccionado mesa
                            </div>
                        )}
                    </div>
                </div>

                {/* Guests & Meals */}
                <div className="card-premium">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                        <span>👥</span> Invitados y Platillos
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-premium-gold/20">
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-premium-silver">#</th>
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-premium-silver">Nombre</th>
                                    <th className="text-left py-3 px-3 text-xs font-semibold text-premium-silver">Platillo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.guests.map((guest, index) => (
                                    <tr key={index} className="border-b border-premium-charcoal">
                                        <td className="py-3 px-3 text-sm text-premium-silver">{index + 1}</td>
                                        <td className="py-3 px-3 font-medium text-premium-platinum">{guest.full_name}</td>
                                        <td className="py-3 px-3">
                                            <span className={`badge-premium ${guest.meal_type === 'vegan'
                                                    ? 'bg-success/20 text-success border-success/30'
                                                    : 'bg-warning/20 text-warning border-warning/30'
                                                }`}>
                                                {guest.meal_type === 'vegan' ? '🥗 Vegano' : '🍖 Tradicional'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payments */}
                <div className="card-premium">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                        <span>💳</span> Estado de Pagos
                    </h2>
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-premium-silver">Progreso</span>
                            <span className="font-mono font-bold text-premium-gold">{data.payments.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-premium-charcoal rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-gold h-3 rounded-full transition-all shadow-premium-gold"
                                style={{ width: `${data.payments.progress_percent}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card-premium bg-success/5 border-success/30">
                            <div className="text-xs text-success mb-1">Pagado</div>
                            <div className="font-mono text-lg font-bold text-success">
                                {formatCurrency(data.payments.paid_amount)}
                            </div>
                        </div>
                        <div className="card-premium bg-warning/5 border-warning/30">
                            <div className="text-xs text-warning mb-1">Pendiente</div>
                            <div className="font-mono text-lg font-bold text-warning">
                                {formatCurrency(data.payments.total_amount - data.payments.paid_amount)}
                            </div>
                        </div>
                        <div className="card-premium bg-premium-gold/5 border-premium-gold/30">
                            <div className="text-xs text-premium-gold mb-1">Total</div>
                            <div className="font-mono text-lg font-bold text-premium-gold">
                                {formatCurrency(data.payments.total_amount)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thermo */}
                <div className="card-premium">
                    <h2 className="font-display text-xl font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                        <span>🎁</span> Termo Personalizado
                    </h2>
                    <div className={`card-premium ${data.thermo.is_unlocked
                            ? 'bg-premium-gold/5 border-premium-gold/30'
                            : 'bg-premium-charcoal border-premium-silver/20'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.thermo.is_unlocked ? 'bg-premium-gold/20' : 'bg-premium-charcoal'
                                    }`}>
                                    <span className="text-2xl">
                                        {data.thermo.is_unlocked ? '🔓' : '🔒'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-premium-platinum mb-1">
                                    {data.thermo.is_unlocked ? 'Desbloqueado' : 'Bloqueado'}
                                </div>
                                {data.thermo.has_customized ? (
                                    <div className="font-display text-lg font-bold text-premium-gold">
                                        {data.thermo.full_text}
                                    </div>
                                ) : (
                                    <div className="text-sm text-premium-silver">
                                        {data.thermo.is_unlocked ? 'Aún no personalizado' : 'Completa tus pagos para desbloquear'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary flex-1"
                    >
                        Volver al Dashboard
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="btn-primary flex-1"
                    >
                        🖨️ Imprimir Resumen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Summary;
