import api from './api';

export const layoutAPI = {
    // Obtiene el croquis del evento del graduado actual.
    // Si se pasa eventId, se usa directamente; si no, se consulta el perfil.
    getLayout: async (eventId?: string) => {
        let resolvedEventId = eventId;

        if (!resolvedEventId) {
            const profileResp = await api.get('/graduates/me');
            resolvedEventId = profileResp.data.event_id;
        }

        return api.get(`/events/${resolvedEventId}/layout/overview`);
    },

    // Selecciona / cambia la mesa del graduado actual
    selectTable: (tableId: string) => {
        return api.post('/graduates/me/layout/selection', { table_id: tableId });
    },
};
