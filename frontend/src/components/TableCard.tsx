import React from 'react';

interface TableCardProps {
    table: {
        id: string;
        label: string;
        capacity: number;
        available_seats: number;
        status: string;
        is_selected_by_me: boolean;
    };
    onClick: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onClick }) => {
    const getStatusColor = () => {
        if (table.is_selected_by_me) return 'bg-blue-500 hover:bg-blue-600 border-blue-700';
        if (table.status === 'blocked') return 'bg-gray-400 cursor-not-allowed';
        if (table.status === 'full') return 'bg-red-500 cursor-not-allowed';
        return 'bg-green-500 hover:bg-green-600 border-green-700';
    };

    const isClickable = table.status === 'available' || table.is_selected_by_me;

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            className={`
        ${getStatusColor()}
        border-2 rounded-lg p-2 text-white text-center
        transition-all duration-200 cursor-pointer
        flex flex-col items-center justify-center
        min-h-[60px] md:min-h-[80px]
        ${isClickable ? 'hover:scale-105 shadow-md hover:shadow-lg' : ''}
      `}
            title={`${table.label} - ${table.available_seats}/${table.capacity} disponibles`}
        >
            <div className="font-bold text-sm md:text-base">{table.label}</div>
            <div className="text-xs opacity-90">
                {table.available_seats}/{table.capacity}
            </div>
        </div>
    );
};

export default TableCard;
