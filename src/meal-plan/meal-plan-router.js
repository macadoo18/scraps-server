const express = require('express');
const path = require('path');
const MealPlanService = require('./meal-plan-service');
const { requireAuth } = require('../auth/jwt-auth');

const mealPlanRouter = express.Router();

mealPlanRouter
  .route('/')
  .all(requireAuth)
  .post((req, res, next) => {
    const db = req.app.get('db');

    // do I need meal_type?
    // should this route just initiate meal plan?
    // doesn't yet add specific recipes?

    const { meal_type, day_of_week } = req.body;

    const newMealPlan = {
      user_id: req.user.id,
      meal_type,
      day_of_week,
    };

    if (!day_of_week) {
      return res.status(400).json({
        error: { message: `Missing ${day_of_week} in request body` },
      });
    }

    MealPlanService.insertMeal(db, newMealPlan)
      .then(meal => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${meal.id}`))
          .json(MealPlanService.serializeMealPlan(meal));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const db = req.app.get('db');

    MealPlanService.getByUserId(db, req.user.id)
      .then(meals => {
        res.json(meals.map(MealPlanService.serializeMealPlan));
      })
      .catch(next);
  });

mealPlanRouter
  .route('/:recipeId')
  .all(requireAuth)
  .post((req, res, next) => {
    const db = req.app.get('db');

    // add new meal to meal plan with post or patch?

    const { meal_type, day_of_week } = req.body;

    const newMeal = {
      user_id: req.user.id,
      recipe_id: req.params.recipeId,
      meal_type,
      day_of_week,
    };

    if (!day_of_week) {
      return res.status(400).json({
        error: { message: `Missing ${day_of_week} in request body` },
      });
    }

    MealPlanService.insertMeal(db, newMeal)
      .then(meal => {
        res
          .status(201)
          .location(path.posix.join(originalUrl, `/${meal.id}`))
          .json(MealPlanService.serializeMealPlan(meal));
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const db = req.app.get('db');

    const mealId = req.params.recipeId;

    MealPlanService.getById(db, mealId)
      .then(meal => {
        if (!meal) {
          return res.status(404).json({
            error: { message: 'Meal does not exist' },
          });
        }
        res.json(MealPlanService.serializeMealPlan(meal));
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const db = req.app.get('db');

    const { meal_type, day_of_week } = req.body;

    const editedMealPlan = {
      meal_type,
      day_of_week,
    };

    const values = Object.values(editedMealPlan).filter(Boolean).length;

    if (values === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain value to update` },
      });
    }

    MealPlanService.updateMealPlan(db, req.params.recipeId, editedMealPlan)
      .then(res.status(201).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.recipeId;

    MealPlanService.deleteMeal(db, id).then(res.status(204).end()).catch(next);
  });

module.exports = mealPlanRouter;
