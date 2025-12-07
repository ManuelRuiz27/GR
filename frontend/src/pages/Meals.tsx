import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealsAPI } from '../services/mealsAPI';

interface Guest {
    id: string;
    full_name: string;
    type: string;
    meal_type: string;
}

const Meals: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [deadline, setDeadline] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadMeals();
    }, []);

    const loadMeals = async () => {
        try {
            setLoading(true);
            const response = await mealsAPI.getMeals();
            setGuests(response.data.guests || []);
            setDeadline(response.data.deadline);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar platillos');
        } finally {
            setLoading(false);
        }
    };

    const handleMealChange = async (guestId: string, mealType: string) => {
        try {
            setUpdating(guestId);
            setError('');
            await mealsAPI.updateMeal(guestId, mealType);

            setGuests(guests.map(g =>
                g.id === guestId ? { ...g, meal_type: mealType } : g
            ));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar platillo');
        } finally {
            setUpdating(null);
        }
    };

    const getMealCounts = () => {
        const traditional = guests.filter(g => g.meal_type === 'traditional').length;
        const vegan = guests.filter(g => g.meal_type === 'vegan').length;
        return { traditional, vegan };
    };

    const currentGuest = guests[currentIndex];
    const counts = getMealCounts();

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-premium mb-4"></div>
                    <p className="text-premium-silver">Cargando platillos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-black pb-24 md:pb-8">
            {/* Header */}
            <header className="bg-gradient-card border-b border-premium-gold/20 sticky top-0 z-40 backdrop-blur-lg">
                <div className="max-w-3xl mx-auto px-4 py-4">
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
                            Platillos
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Counts */}
                <div className="card-premium">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-4xl mb-2">🍖</div>
                            <div className="font-mono text-3xl font-bold text-warning">{counts.traditional}</div>
                            <div className="text-xs text-premium-silver mt-1">Tradicional</div>
                        </div>
                        <div>
                            <div className="text-4xl mb-2">🥗</div>
                            <div className="font-mono text-3xl font-bold text-success">{counts.vegan}</div>
                            <div className="text-xs text-premium-silver mt-1">Vegano</div>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-error/10 border border-error/30 rounded-md p-4">
                        <p className="text-error text-sm">{error}</p>
                    </div>
                )}

                {/* Current Guest Card */}
                {currentGuest && (
                    <div className="card-premium">
                        <div className="text-center mb-6">
                            <div className="text-sm text-premium-silver mb-2">
                                Invitado {currentIndex + 1} de {guests.length}
                            </div>
                            <h2 className="font-display text-2xl font-bold text-premium-platinum mb-1">
                                {currentGuest.full_name}
                            </h2>
                            <div className="badge-gold">
                                {currentGuest.type === 'graduate' ? 'Graduado' : 'Invitado'}
                            </div>
                        </div>

                        {/* Meal Options */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleMealChange(currentGuest.id, 'traditional')}
                                disabled={updating === currentGuest.id}
                                className={`card-premium-hover p-6 text-center transition-all ${currentGuest.meal_type === 'traditional'
                                        ? 'border-warning/60 bg-warning/10 shadow-premium-md'
                                        : 'border-premium-silver/20'
                                    }`}
                            >
                                <div className="text-5xl mb-3">🍖</div>
                                <div className="font-semibold text-premium-platinum mb-1">Tradicional</div>
                                <div className="text-xs text-premium-silver">Menú clásico</div>
                                {currentGuest.meal_type === 'traditional' && (
                                    <div className="mt-3">
                                        <span className="badge-warning">✓ Seleccionado</span>
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => handleMealChange(currentGuest.id, 'vegan')}
                                disabled={updating === currentGuest.id}
                                className={`card-premium-hover p-6 text-center transition-all ${currentGuest.meal_type === 'vegan'
                                        ? 'border-success/60 bg-success/10 shadow-premium-md'
                                        : 'border-premium-silver/20'
                                    }`}
                            >
                                <div className="text-5xl mb-3">🥗</div>
                                <div className="font-semibold text-premium-platinum mb-1">Vegano</div>
                                <div className="text-xs text-premium-silver">Menú plant-based</div>
                                {currentGuest.meal_type === 'vegan' && (
                                    <div className="mt-3">
                                        <span className="badge-success">✓ Seleccionado</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="btn-secondary flex-1"
                            >
                                ← Anterior
                            </button>
                            <button
                                onClick={() => setCurrentIndex(Math.min(guests.length - 1, currentIndex + 1))}
                                disabled={currentIndex === guests.length - 1}
                                className="btn-primary flex-1"
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}

                {/* Deadline */}
                {deadline && (
                    <div className="card-premium bg-info/5 border-info/30 text-center">
                        <div className="text-sm text-info mb-1">Fecha límite para selección</div>
                        <div className="font-semibold text-premium-platinum">
                            {new Date(deadline).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                    </div>
                )}

                {/* All Guests List */}
                <div className="card-premium">
                    <h3 className="font-display text-lg font-semibold text-premium-platinum mb-4">
                        Todos los Invitados
                    </h3>
                    <div className="space-y-2">
                        {guests.map((guest, index) => (
                            <button
                                key={guest.id}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-full card-premium-hover p-3 flex items-center justify-between ${index === currentIndex ? 'border-premium-gold/60 bg-premium-gold/5' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-premium-silver font-mono">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-premium-platinum text-sm">
                                            {guest.full_name}
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge-premium ${guest.meal_type === 'vegan'
                                        ? 'bg-success/20 text-success border-success/30'
                                        : 'bg-warning/20 text-warning border-warning/30'
                                    }`}>
                                    {guest.meal_type === 'vegan' ? '🥗' : '🍖'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meals;
