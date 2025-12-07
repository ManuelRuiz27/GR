import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface TicketSelectorProps {
    onComplete: () => void;
}

interface EventData {
    ticket_price: number;
    initial_payment: number;
    months_duration: number;
}

type MealType = 'adult' | 'child';

interface Guest {
    id: number;
    mealType: MealType;
}

const TicketSelector: React.FC<TicketSelectorProps> = ({ onComplete }) => {
    const [ticketCount, setTicketCount] = useState(1);
    const [guests, setGuests] = useState<Guest[]>([{ id: 1, mealType: 'adult' }]);
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEventData();
    }, []);

    useEffect(() => {
        // Actualizar array de invitados cuando cambia la cantidad
        const newGuests: Guest[] = [];
        for (let i = 1; i <= ticketCount; i++) {
            const existing = guests.find(g => g.id === i);
            newGuests.push({
                id: i,
                mealType: existing?.mealType || 'adult',
            });
        }
        setGuests(newGuests);
    }, [ticketCount]);

    const loadEventData = async () => {
        try {
            const response = await api.get('/graduates/me/dashboard');
            const event = response.data.event;
            setEventData({
                ticket_price: Number(event.ticket_price),
                initial_payment: Number(event.initial_payment),
                months_duration: event.months_duration,
            });
        } catch (err) {
            console.error('Error loading event data:', err);
        }
    };

    const handleIncrement = () => {
        if (ticketCount < 20) {
            setTicketCount(ticketCount + 1);
        }
    };

    const handleDecrement = () => {
        if (ticketCount > 1) {
            setTicketCount(ticketCount - 1);
        }
    };

    const handleMealTypeChange = (guestId: number, mealType: MealType) => {
        setGuests(guests.map(g =>
            g.id === guestId ? { ...g, mealType } : g
        ));
    };

    const getTotalPrice = () => {
        if (!eventData) return 0;
        return ticketCount * eventData.ticket_price;
    };

    const getMonthlyPayment = () => {
        if (!eventData) return 0;
        const total = getTotalPrice();
        const remaining = total - eventData.initial_payment;
        return Math.ceil(remaining / eventData.months_duration);
    };

    const getMealCounts = () => {
        const adult = guests.filter(g => g.mealType === 'adult').length;
        const child = guests.filter(g => g.mealType === 'child').length;
        return { adult, child };
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');

        try {
            // Crear boletos
            await api.post('/graduates/me/tickets', {
                tickets_count: ticketCount,
            });

            // Obtener lista de invitados creados
            const guestsResponse = await api.get('/graduates/me/guests');
            const createdGuests = guestsResponse.data;

            // Asignar platillos a cada invitado
            for (let i = 0; i < createdGuests.length && i < guests.length; i++) {
                await api.patch(`/graduates/me/guests/${createdGuests[i].id}`, {
                    meal_type: guests[i].mealType,
                });
            }

            onComplete();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al confirmar selección');
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

    if (!eventData) {
        return (
            <div className="text-center py-8">
                <div className="spinner-premium mb-4"></div>
                <p className="text-premium-silver">Cargando información...</p>
            </div>
        );
    }

    const mealCounts = getMealCounts();

    return (
        <div className="space-y-6">
            {/* Selector de Cantidad */}
            <div className="text-center">
                <h3 className="font-display text-2xl font-semibold text-premium-platinum mb-2">
                    ¿Cuántos boletos necesitas?
                </h3>
                <p className="text-sm text-premium-silver mb-8">
                    Incluye tu boleto y los de tus invitados
                </p>

                <div className="flex items-center justify-center gap-6 mb-8">
                    <button
                        onClick={handleDecrement}
                        disabled={ticketCount <= 1}
                        className="w-14 h-14 rounded-full bg-premium-charcoal border-2 border-premium-gold/30 text-premium-gold text-2xl font-bold hover:border-premium-gold hover:bg-premium-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        −
                    </button>

                    <div className="w-32 h-32 rounded-full bg-gradient-gold flex items-center justify-center shadow-premium-glow">
                        <span className="text-5xl font-bold text-premium-black">{ticketCount}</span>
                    </div>

                    <button
                        onClick={handleIncrement}
                        disabled={ticketCount >= 20}
                        className="w-14 h-14 rounded-full bg-premium-charcoal border-2 border-premium-gold/30 text-premium-gold text-2xl font-bold hover:border-premium-gold hover:bg-premium-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>

                <p className="text-xs text-premium-silver/70">
                    Mínimo 1 boleto • Máximo 20 boletos
                </p>
            </div>

            {/* Selección de Platillos */}
            <div className="card-premium">
                <h4 className="font-semibold text-premium-platinum mb-4 flex items-center gap-2">
                    🍽️ Selecciona el platillo para cada invitado
                </h4>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {guests.map((guest, index) => (
                        <div key={guest.id} className="flex items-center justify-between p-3 bg-premium-charcoal/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-premium-gold/20 flex items-center justify-center text-premium-gold font-semibold text-sm">
                                    {index + 1}
                                </div>
                                <span className="text-premium-platinum">
                                    {index === 0 ? 'Graduado' : `Invitado ${index}`}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMealTypeChange(guest.id, 'adult')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${guest.mealType === 'adult'
                                        ? 'bg-premium-gold text-premium-black'
                                        : 'bg-premium-charcoal border border-premium-silver/20 text-premium-silver hover:border-premium-gold/50'
                                        }`}
                                >
                                    🍖 Tradicional
                                </button>
                                <button
                                    onClick={() => handleMealTypeChange(guest.id, 'child')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${guest.mealType === 'child'
                                        ? 'bg-premium-gold text-premium-black'
                                        : 'bg-premium-charcoal border border-premium-silver/20 text-premium-silver hover:border-premium-gold/50'
                                        }`}
                                >
                                    🥗 Vegano
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen de Platillos */}
                <div className="mt-4 p-3 bg-premium-gold/10 border border-premium-gold/30 rounded-lg flex justify-center gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-premium-gold">{mealCounts.adult}</div>
                        <div className="text-xs text-premium-silver">Tradicional</div>
                    </div>
                    <div className="w-px bg-premium-gold/30"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-premium-gold">{mealCounts.child}</div>
                        <div className="text-xs text-premium-silver">Vegano</div>
                    </div>
                </div>
            </div>

            {/* Resumen de Costos */}
            <div className="card-premium space-y-4">
                <h4 className="font-semibold text-premium-platinum mb-4">💰 Resumen de Costos</h4>

                <div className="flex justify-between items-center py-2 border-b border-premium-silver/10">
                    <span className="text-premium-silver">Precio por boleto</span>
                    <span className="font-mono text-premium-platinum">{formatCurrency(eventData.ticket_price)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-premium-silver/10">
                    <span className="text-premium-silver">Cantidad</span>
                    <span className="font-mono text-premium-platinum">{ticketCount} boletos</span>
                </div>

                <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-premium-platinum">Total</span>
                    <span className="font-mono text-2xl font-bold text-premium-gold">
                        {formatCurrency(getTotalPrice())}
                    </span>
                </div>
            </div>

            {/* Plan de Pagos */}
            <div className="card-premium space-y-4">
                <h4 className="font-semibold text-premium-platinum mb-4">📅 Plan de Pagos</h4>

                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-premium-charcoal/50 rounded-lg">
                        <div>
                            <div className="font-medium text-premium-platinum">Pago Inicial</div>
                            <div className="text-xs text-premium-silver">Al confirmar boletos</div>
                        </div>
                        <div className="font-mono font-bold text-premium-gold">
                            {formatCurrency(eventData.initial_payment)}
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-premium-charcoal/50 rounded-lg">
                        <div>
                            <div className="font-medium text-premium-platinum">Mensualidades</div>
                            <div className="text-xs text-premium-silver">{eventData.months_duration} pagos mensuales</div>
                        </div>
                        <div className="font-mono font-bold text-premium-platinum">
                            {formatCurrency(getMonthlyPayment())} <span className="text-sm text-premium-silver">/mes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-error/10 border border-error/30 rounded-lg p-4">
                    <p className="text-error text-sm">{error}</p>
                </div>
            )}

            {/* Botón de Confirmación */}
            <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="spinner-premium w-5 h-5 border-2"></div>
                        Confirmando...
                    </span>
                ) : (
                    `Confirmar ${ticketCount} ${ticketCount === 1 ? 'Boleto' : 'Boletos'} y Platillos`
                )}
            </button>

            <p className="text-xs text-center text-premium-silver/70">
                Al confirmar, se crearán tus boletos con los platillos seleccionados
            </p>
        </div>
    );
};

export default TicketSelector;
