const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const recipesRouter = require('./recipes/recipes-router');
const mealPlanRouter = require('./meal-plan/meal-plan-router');
const { NODE_ENV } = require('./config');

const app = express();
app.use(express.json());

const morganOptions = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOptions));
app.use(cors());
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/mealplan', mealPlanRouter);

app.get('/', (req, res, next) => {
  res.send('Sending from app.js');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error.message, error };
  }
  console.error(error);
  res.status(500).json(response);
});

module.exports = app;
