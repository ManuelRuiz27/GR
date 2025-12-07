import React, { useState, useEffect } from 'react';
import { graduateAPI } from '../services/api';

const GuestManager: React.FC = () => {
    const [guests, setGuests] = useState<any[]>([]);
    const [ticketsCount, setTicketsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [additionalGuests, setAdditionalGuests] = useState(1);
    const [retroactiveInfo, setRetroactiveInfo] = useState<any>(null);
    const [editingGuest, setEditingGuest] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        loadGuests();
    }, []);

    const loadGuests = async () => {
        try {
            const response = await graduateAPI.getGuests();
            setGuests(response.data.guests);
            setTicketsCount(response.data.tickets_count);
        } catch (error) {
            console.error('Error loading guests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGuests = async () => {
        try {
            setLoading(true);
            const response = await graduateAPI.addGuests({ additional_guests: additionalGuests });
            setRetroactiveInfo(response.data.financial_impact);
            await loadGuests();
            setShowAddForm(false);
            setAdditionalGuests(1);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al agregar invitados');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGuest = async (guestId: string) => {
        try {
            await graduateAPI.updateGuest(guestId, { full_name: editName });
            await loadGuests();
            setEditingGuest(null);
            setEditName('');
        } catch (error) {
            alert('Error al actualizar invitado');
        }
    };

    const startEdit = (guest: any) => {
        setEditingGuest(guest.id);
        setEditName(guest.full_name);
    };

    if (loading) {
        return <div className="text-center py-8">Cargando...</div>;
    }

    return (
        <div className="card max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Mis Invitados ({ticketsCount} boletos)
                </h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary"
                >
                    + Agregar Invitados
                </button>
            </div>

            {retroactiveInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-blue-800 mb-2">✅ Invitados Agregados</h3>
                    <div className="text-sm text-blue-700">
                        <p>• Nuevos boletos: {retroactiveInfo.new_tickets_count}</p>
                        <p>• Monto adicional: ${retroactiveInfo.extra_total_amount.toLocaleString()} MXN</p>
                        <p>• Retroactivos ({retroactiveInfo.retroactive_months} meses): ${retroactiveInfo.retroactive_amount.toLocaleString()} MXN</p>
                        <p className="font-bold mt-2">
                            Nueva mensualidad: ${retroactiveInfo.updated_monthly_payment.toLocaleString()} MXN
                        </p>
                    </div>
                    <button
                        onClick={() => setRetroactiveInfo(null)}
                        className="text-sm text-blue-600 underline mt-2"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {showAddForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Agregar Invitados Adicionales</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                        <button
                            onClick={() => setAdditionalGuests(Math.max(1, additionalGuests - 1))}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            -
                        </button>
                        <span className="text-2xl font-bold text-primary-600 w-12 text-center">
                            {additionalGuests}
                        </span>
                        <button
                            onClick={() => setAdditionalGuests(Math.min(10, additionalGuests + 1))}
                            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>
                    <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded mb-4">
                        ⚠️ Los invitados nuevos deben pagar los meses anteriores (retroactivos)
                    </p>
                    <div className="flex gap-2">
                        <button onClick={handleAddGuests} className="btn-primary">
                            Confirmar
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {guests.map((guest, index) => (
                    <div
                        key={guest.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                {index + 1}
                            </div>
                            {editingGuest === guest.id ? (
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="input-field"
                                    autoFocus
                                />
                            ) : (
                                <div>
                                    <p className="font-semibold text-gray-800">{guest.full_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {guest.type === 'graduate' ? '👨‍🎓 Graduado' : '👤 Invitado'} •
                                        {guest.meal_type === 'traditional' ? ' 🍖 Tradicional' : ' 🥗 Vegano'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {editingGuest === guest.id ? (
                                <>
                                    <button
                                        onClick={() => handleUpdateGuest(guest.id)}
                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() => setEditingGuest(null)}
                                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => startEdit(guest)}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {guests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No hay invitados registrados</p>
                    <p className="text-sm">Primero debes seleccionar tus boletos</p>
                </div>
            )}
        </div>
    );
};

export default GuestManager;
