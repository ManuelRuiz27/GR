import api from './api';

export const paymentsAPI = {
    getConfig: () => {
        return api.get('/payments/config');
    },

    getSummary: () => {
        return api.get('/payments/summary');
    },

    getHistory: () => {
        return api.get('/payments/history');
    },

    createCharge: (data: {
        payment_method: 'card' | 'bank_account' | 'store';
        token?: string;
        payment_type: 'initial' | 'monthly';
        month_number?: number;
    }) => {
        return api.post('/payments/charge', data);
    },
};
