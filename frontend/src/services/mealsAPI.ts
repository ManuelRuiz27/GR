import api from './api';

export const mealsAPI = {
    getMeals: () => {
        return api.get('/meals');
    },

    assignMeals: (assignments: Array<{ guest_id: string; meal_option_id: string }>) => {
        return api.post('/meals/assign', { assignments });
    },
};
