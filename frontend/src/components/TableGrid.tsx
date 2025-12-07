import React from 'react';
import TableCard from './TableCard';

interface Table {
    id: string;
    label: string;
    capacity: number;
    available_seats: number;
    status: string;
    is_selected_by_me: boolean;
    position_x: number;
    position_y: number;
}

interface TableGridProps {
    tables: Table[];
    onTableClick: (table: Table) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
    return (
        <div className="w-full overflow-auto">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 p-4 min-w-[300px]">
                {tables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        onClick={() => onTableClick(table)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TableGrid;
