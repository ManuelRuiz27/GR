import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { layoutAPI } from '../services/layoutAPI';

interface Table {
    id: string;
    label: string;
    capacity: number;
    position_x: number;
    position_y: number;
    status: string;
}

const Layout: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [mySelection, setMySelection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadLayout();
    }, []);

    const loadLayout = async () => {
        try {
            setLoading(true);
            const layoutResp = await layoutAPI.getLayout();

            const layoutData = layoutResp.data;
            const tablesData: Table[] = layoutData.tables || [];

            setTables(tablesData);
            setMySelection(layoutData.my_selection);

            if (layoutData.my_selection) {
                const currentTable = tablesData.find(
                    (t: Table) => t.id === layoutData.my_selection.table_id
                );
                if (currentTable) {
                    setSelectedTable(currentTable);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar croquis');
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = async (table: Table) => {
        if ((table.status === 'full' || table.status === 'blocked') && table.id !== mySelection?.table_id) {
            setError('Esta mesa ya está ocupada');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            await layoutAPI.selectTable(table.id);
            setSelectedTable(table);
            await loadLayout();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al seleccionar mesa');
        } finally {
            setSubmitting(false);
        }
    };

    const getTableColor = (table: Table) => {
        if (table.id === selectedTable?.id) {
            return 'bg-premium-gold/30 border-premium-gold shadow-premium-gold';
        }
        if (table.status === 'full' || table.status === 'blocked') {
            return 'bg-error/20 border-error/50';
        }
        return 'bg-success/20 border-success/50 hover:bg-success/30';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-premium mb-4"></div>
                    <p className="text-premium-silver">Cargando croquis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-black pb-24 md:pb-8">
            {/* Header */}
            <header className="bg-gradient-card border-b border-premium-gold/20 sticky top-0 z-40 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
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
                            Selecciona tu Mesa
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Legend */}
                <div className="card-premium">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-success/30 border border-success"></div>
                            <span className="text-premium-silver">Disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-error/30 border border-error"></div>
                            <span className="text-premium-silver">Ocupada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-premium-gold/30 border border-premium-gold"></div>
                            <span className="text-premium-silver">Tu selección</span>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-error/10 border border-error/30 rounded-md p-4">
                        <p className="text-error text-sm">{error}</p>
                    </div>
                )}

                {/* Layout Grid */}
                <div className="card-premium overflow-x-auto">
                    <div className="min-w-[600px] h-[500px] relative bg-gradient-dark rounded-lg p-8">
                        {/* Stage */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-premium-gold/20 border border-premium-gold/50 rounded-lg px-8 py-3">
                            <div className="text-premium-gold font-semibold text-sm">🎤 Escenario</div>
                        </div>

                        {/* Tables */}
                        {tables.map((table) => (
                            <button
                                key={table.id}
                                onClick={() => handleTableSelect(table)}
                                disabled={
                                    submitting ||
                                    ((table.status === 'full' || table.status === 'blocked') &&
                                        table.id !== mySelection?.table_id)
                                }
                                className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all ${getTableColor(table)
                                    } ${(table.status === 'full' || table.status === 'blocked') && table.id !== mySelection?.table_id
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer hover:scale-110'
                                    }`}
                                style={{
                                    left: `${table.position_x}%`,
                                    top: `${table.position_y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="text-center">
                                    <div className="font-bold text-premium-platinum text-xs">
                                        {table.label}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Table Info */}
                {selectedTable && (
                    <div className="card-premium border-premium-gold/60 bg-premium-gold/5">
                        <h3 className="font-display text-xl font-semibold text-premium-platinum mb-4">
                            Mesa Seleccionada
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-premium-silver mb-1">Mesa</div>
                                <div className="font-display text-3xl font-bold text-premium-gold">
                                    {selectedTable.label}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-premium-silver mb-1">Capacidad</div>
                                <div className="text-2xl font-bold text-premium-platinum">
                                    {selectedTable.capacity} personas
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="card-premium bg-info/5 border-info/30">
                    <h3 className="font-semibold text-info mb-3 flex items-center gap-2">
                        <span>ℹ️</span> Información
                    </h3>
                    <ul className="text-sm text-premium-silver space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Toca una mesa disponible para seleccionarla</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Puedes cambiar de mesa en cualquier momento</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Las mesas ocupadas no están disponibles</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Usa zoom con los dedos en móvil para ver mejor</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Layout;
