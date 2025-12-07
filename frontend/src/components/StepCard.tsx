import React from 'react';

interface StepCardProps {
    title: string;
    description: string;
    status: 'completed' | 'current' | 'locked';
    icon: string;
    onClick?: () => void;
    details?: string;
}

const StepCard: React.FC<StepCardProps> = ({
    title,
    description,
    status,
    icon,
    onClick,
    details,
}) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <span className="text-2xl">✓</span>;
            case 'current':
                return <span className="text-2xl">→</span>;
            case 'locked':
                return <span className="text-2xl">🔒</span>;
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'completed':
                return 'border-success/40 bg-success/5';
            case 'current':
                return 'border-premium-gold/60 bg-premium-gold/10 shadow-premium-gold animate-pulse-gold';
            case 'locked':
                return 'border-premium-silver/20 bg-premium-charcoal/50 opacity-60';
        }
    };

    const getTextClass = () => {
        switch (status) {
            case 'completed':
                return 'text-success';
            case 'current':
                return 'text-premium-gold';
            case 'locked':
                return 'text-premium-silver/50';
        }
    };

    return (
        <div
            className={`card-premium ${getStatusClass()} ${status !== 'locked' && onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
                } transition-all duration-base animate-fadeInUp`}
            onClick={status !== 'locked' ? onClick : undefined}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${status === 'current' ? 'bg-premium-gold/20' : 'bg-premium-charcoal'
                    }`}>
                    <span className="text-2xl">{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-display text-lg font-semibold ${status === 'locked' ? 'text-premium-silver/50' : 'text-premium-platinum'
                            }`}>
                            {title}
                        </h3>
                        <div className={getTextClass()}>
                            {getStatusIcon()}
                        </div>
                    </div>

                    <p className="text-sm text-premium-silver mb-2">
                        {description}
                    </p>

                    {details && status !== 'locked' && (
                        <p className="text-xs text-premium-silver/70">
                            {details}
                        </p>
                    )}

                    {status === 'current' && onClick && (
                        <div className="mt-3">
                            <span className="text-sm font-medium text-premium-gold flex items-center gap-1">
                                Continuar
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepCard;
