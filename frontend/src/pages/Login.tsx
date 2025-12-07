import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-premium-black flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <div className="inline-block mb-4">
                        <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center shadow-premium-glow">
                            <span className="text-4xl">🎓</span>
                        </div>
                    </div>
                    <h1 className="font-display text-4xl font-bold text-premium-platinum mb-2">
                        Plataforma GR
                    </h1>
                    <p className="text-premium-silver text-sm">
                        Graduación 2025
                    </p>
                </div>

                {/* Login Card */}
                <div className="card-premium animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                    <h2 className="font-display text-2xl font-semibold text-premium-platinum mb-6 text-center">
                        Iniciar Sesión
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-premium-silver mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium"
                                placeholder="tu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-premium-silver mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
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
                                    Iniciando...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider-premium"></div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-sm text-premium-silver mb-3">
                            ¿No tienes cuenta?
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-secondary w-full"
                            disabled={loading}
                        >
                            Crear Cuenta
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <p className="text-xs text-premium-silver/50">
                        © 2025 GR Producciones. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
