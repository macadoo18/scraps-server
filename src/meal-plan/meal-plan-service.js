const xss = require('xss');

const MealPlanService = {
  insertMeal(db, newMeal) {
    return db
      .insert(newMeal)
      .into('meal_plan')
      .returning('*')
      .then(([meal]) => meal);
  },
  getById(db, id) {
    return db.from('meal_plan').select('*').where({ id }).first();
  },
  getByUserId(db, user_id) {
    return db.select('*').from('meal_plan').where({ user_id });
  },
  updateMealPlan(db, id, meal_plan) {
    return db.from('meal_plan').where({ id }).update(meal_plan);
  },
  deleteMeal(db, recipe_id) {
    return db.from('meal_plan').where({ recipe_id }).delete();
  },
  deleteMealPlan(db, id) {
    return db.from('meal_plan').where({ id }).delete();
  },
  serializeMealPlan(meal) {
    return {
      id: meal.id,
      user_id: meal.user_id,
      recipe_id: meal.recipe_id,
      meal_type: meal.meal_type,
      day_of_week: meal.day_of_week,
    };
  },
};

module.exports = MealPlanService;
