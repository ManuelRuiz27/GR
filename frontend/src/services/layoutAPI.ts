import api from './api';

export const layoutAPI = {
    getTables: () => {
        return api.get('/tables');
    },

    getMySelection: () => {
        return api.get('/tables/my-selection');
    },

    selectTable: (tableId: string) => {
        return api.post('/tables/select', { table_id: tableId });
    },
};
