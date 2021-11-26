const express = require('express');
const path = require('path');
const RecipesService = require('./recipes-service');
const { requireAuth } = require('../auth/jwt-auth');

const recipesRouter = express.Router();

recipesRouter
  .route('/')
  //.all(requireAuth)
  .post((req, res, next) => {
    const db = req.app.get('db');

    const { name, type } = req.body;
    const newRecipe = {
      user_id: req.user.id,
      name,
      type,
    };

    for (const [key, value] of Object.entries(newRecipe))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });

    RecipesService.insertRecipe(db, newRecipe)
      .then(recipe => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
          .json(RecipesService.serializeRecipe(recipe));
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    const db = req.app.get('db');

    RecipesService.getByUserId(db, req.user.id)
      .then(recipes => {
        res.json(recipes.map(RecipesService.serializeRecipe));
      })
      .catch(next);
  });

recipesRouter
  .route('/:recipeId')
  .all(requireAuth, (req, res, next) => {
    const db = req.app.get('db');

    RecipesService.getById(db, req.params.recipeId)
      .then(recipe => {
        if (!recipe) {
          return res.status(401).json({
            error: { message: 'Recipe does not exist' },
          });
        }
        res.recipe = recipe;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(RecipesService.serializeRecipe(res.recipe));
  })
  .patch((req, res, next) => {
    const db = req.app.get('db');
    const { name, category, type } = req.body;
    const updatedRecipe = {};

    if (name) {
      updatedRecipe.name = name;
    }

    if (category) {
      updatedRecipe.category = category;
    }

    if (type) {
      updatedRecipe.type = type;
    }

    const values = Object.values(updatedRecipe).length;
    if (values === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain value to update` },
      });
    }

    RecipesService.updateRecipe(db, req.params.recipeId, updatedRecipe)
      .then(recipe => {
        res.status(200).json(RecipesService.serializeRecipe(recipe));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');

    RecipesService.deleteRecipe(db, req.params.recipeId)
      .then(res.status(204).end())
      .catch(next);
  });

module.exports = recipesRouter;
