import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        career: '',
        generation: '',
        group: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            await register({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                career: formData.career,
                generation: formData.generation,
                group: formData.group || undefined,
                password: formData.password,
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear cuenta');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-premium-black py-12 px-4">
            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fadeInUp">
                    <div className="inline-block mb-4">
                        <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center shadow-premium-glow">
                            <span className="text-3xl">🎓</span>
                        </div>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-premium-platinum mb-2">
                        Crear Cuenta
                    </h1>
                    <p className="text-premium-silver text-sm">
                        Completa tus datos para comenzar
                    </p>
                </div>

                {/* Register Card */}
                <div className="card-premium animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-premium-silver mb-2">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="Juan Pérez García"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="tu@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="5512345678"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Career & Generation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Carrera *
                                </label>
                                <input
                                    type="text"
                                    name="career"
                                    value={formData.career}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="Ingeniería en Sistemas"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Generación *
                                </label>
                                <input
                                    type="text"
                                    name="generation"
                                    value={formData.generation}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="2020-2024"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Group (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-premium-silver mb-2">
                                Grupo (Opcional)
                            </label>
                            <input
                                type="text"
                                name="group"
                                value={formData.group}
                                onChange={handleChange}
                                className="input-premium"
                                placeholder="A"
                                disabled={loading}
                            />
                        </div>

                        {/* Password & Confirm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-premium-silver mb-2">
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-premium"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-error/10 border border-error/30 rounded-md p-3 animate-fadeInUp">
                                <p className="text-error text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="spinner-premium w-5 h-5 border-2"></div>
                                    Creando cuenta...
                                </span>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider-premium"></div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-premium-silver mb-3">
                            ¿Ya tienes cuenta?
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-secondary w-full"
                            disabled={loading}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
