import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: '🏠', label: 'Inicio' },
        { path: '/summary', icon: '📊', label: 'Progreso' },
        { path: '/payments', icon: '💳', label: 'Pagos' },
    ];

    return (
        <nav className="bottom-nav md:hidden">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''
                            }`}
                    >
                        <span className="text-2xl mb-1">{item.icon}</span>
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
