import api from './api';

export const thermoAPI = {
    getStatus: () => {
        return api.get('/thermo/status');
    },

    customize: (data: { prefix: string; name: string }) => {
        return api.post('/thermo/customize', data);
    },
};
