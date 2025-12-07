import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { thermoAPI } from '../services/thermoAPI';

interface ThermoStatus {
    is_unlocked: boolean;
    has_customized: boolean;
    thermo_step: string;
    progress_percent: number;
    threshold: number;
    thermo_prefix: string | null;
    thermo_name: string | null;
}

const Thermo: React.FC = () => {
    const [status, setStatus] = useState<ThermoStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prefix: '',
        name: '',
    });

    const prefixes = ['', 'Lic.', 'Ing.', 'Arq.', 'Dr.', 'Mtro.', 'Mtra.', 'C.'];

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            setLoading(true);
            const response = await thermoAPI.getStatus();
            setStatus(response.data);

            if (response.data.has_customized) {
                setFormData({
                    prefix: response.data.thermo_prefix || '',
                    name: response.data.thermo_name || '',
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar estado del termo');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.name.length > 14) {
            setError('El nombre no puede exceder 14 caracteres');
            return;
        }

        if (formData.name.trim().length === 0) {
            setError('El nombre es requerido');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            await thermoAPI.customize({
                prefix: formData.prefix,
                name: formData.name.trim(),
            });

            setSuccess('¡Termo personalizado exitosamente!');
            await loadStatus();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al personalizar termo');
        } finally {
            setSubmitting(false);
        }
    };

    const getFullText = () => {
        if (formData.prefix) {
            return `${formData.prefix} ${formData.name}`;
        }
        return formData.name;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-black flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-premium mb-4"></div>
                    <p className="text-premium-silver">Cargando estado del termo...</p>
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
                            Termo Personalizado
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Status Card */}
                {status && (
                    <div className={`card-premium ${status.is_unlocked
                            ? 'border-premium-gold/60 bg-premium-gold/5 animate-pulse-gold'
                            : 'border-premium-silver/20'
                        }`}>
                        <div className="text-center">
                            <div className="inline-block mb-4">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${status.is_unlocked ? 'bg-premium-gold/20' : 'bg-premium-charcoal'
                                    }`}>
                                    <span className="text-4xl">
                                        {status.is_unlocked ? '🔓' : '🔒'}
                                    </span>
                                </div>
                            </div>

                            <h2 className="font-display text-2xl font-bold text-premium-platinum mb-2">
                                {status.is_unlocked ? 'Termo Desbloqueado' : 'Termo Bloqueado'}
                            </h2>

                            <p className="text-premium-silver mb-4">
                                {status.is_unlocked
                                    ? status.has_customized
                                        ? 'Ya personalizaste tu termo'
                                        : '¡Personaliza tu termo ahora!'
                                    : `Alcanza ${status.threshold}% de pago para desbloquear`}
                            </p>

                            {/* Progress Bar */}
                            {!status.is_unlocked && (
                                <div className="max-w-md mx-auto">
                                    <div className="flex justify-between text-xs text-premium-silver mb-2">
                                        <span>Progreso actual</span>
                                        <span className="font-mono">{status.progress_percent}%</span>
                                    </div>
                                    <div className="w-full bg-premium-charcoal rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-gold h-3 rounded-full transition-all duration-500 shadow-premium-gold"
                                            style={{ width: `${status.progress_percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-premium-silver/50 mt-1">
                                        <span>0%</span>
                                        <span className="text-premium-gold">{status.threshold}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-error/10 border border-error/30 rounded-md p-4 animate-fadeInUp">
                        <p className="text-error text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-success/10 border border-success/30 rounded-md p-4 animate-fadeInUp">
                        <p className="text-success text-sm">{success}</p>
                    </div>
                )}

                {/* Customization Form */}
                {status?.is_unlocked && (
                    <div className="card-premium">
                        <h3 className="font-display text-xl font-semibold text-premium-platinum mb-6">
                            Personaliza tu Termo
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Prefix Selector */}
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-3">
                                    Prefijo (Opcional)
                                </label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {prefixes.map((prefix) => (
                                        <button
                                            key={prefix}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, prefix })}
                                            className={`px-3 py-2 rounded-md font-medium transition-all ${formData.prefix === prefix
                                                    ? 'bg-gradient-gold text-premium-black shadow-premium-gold'
                                                    : 'bg-premium-charcoal text-premium-silver border border-premium-silver/20 hover:border-premium-gold/50'
                                                }`}
                                        >
                                            {prefix || 'Sin'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Nombre (Máximo 14 caracteres)
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="JUAN PEREZ"
                                    className="input-premium uppercase"
                                    maxLength={14}
                                    required
                                    disabled={!status.is_unlocked || submitting}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-xs text-premium-silver/70">
                                        Usa mayúsculas para mejor legibilidad
                                    </div>
                                    <div className={`text-xs font-mono ${formData.name.length > 12 ? 'text-warning' : 'text-premium-silver'
                                        }`}>
                                        {formData.name.length}/14
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-gold opacity-10 blur-2xl"></div>
                                <div className="relative card-premium bg-gradient-dark text-center py-12">
                                    <div className="text-xs text-premium-silver mb-3">Vista Previa</div>
                                    <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold tracking-wide mb-4">
                                        {getFullText() || 'TU NOMBRE AQUÍ'}
                                    </div>
                                    <div className="inline-block">
                                        <div className="w-32 h-32 bg-gradient-gold rounded-full opacity-20 animate-pulse-gold"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn-primary w-full"
                                disabled={!status.is_unlocked || submitting || formData.name.trim().length === 0}
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="spinner-premium w-5 h-5 border-2"></div>
                                        Guardando...
                                    </span>
                                ) : status.has_customized ? (
                                    'Actualizar Termo'
                                ) : (
                                    'Personalizar Termo'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Info Card */}
                <div className="card-premium bg-info/5 border-info/30">
                    <h3 className="font-semibold text-info mb-3 flex items-center gap-2">
                        <span>ℹ️</span> Información
                    </h3>
                    <ul className="text-sm text-premium-silver space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>El termo se desbloquea al alcanzar {status?.threshold}% de pago</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Puedes elegir un prefijo profesional (Lic., Ing., Arq., etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>El nombre puede tener máximo 14 caracteres</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Puedes modificar tu termo mientras esté desbloqueado</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-premium-gold">•</span>
                            <span>Solo recibirás un termo por graduado</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Thermo;
