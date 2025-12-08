import api from './api';

export const mealsAPI = {
    getMeals: () => {
        return api.get('/graduates/me/meals');
    },

    updateMeal: (guestId: string, mealType: string) => {
        return api.patch(`/graduates/me/meals/${guestId}`, { meal_type: mealType });
    },
};
