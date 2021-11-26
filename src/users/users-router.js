const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const { requireAuth } = require('../auth/jwt-auth');

const usersRouter = express.Router();

usersRouter
  .route('/')
  .post((req, res, next) => {
    const db = req.app.get('db');
    const { username, email, password } = req.body;

    for (const field of ['username', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing ${field} in request body`,
        });

    const passwordError = UsersService.validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(db, username)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password).then(hashedPassword => {
          const newUser = {
            username,
            email,
            password: hashedPassword,
          };

          return UsersService.insertUser(db, newUser).then(user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          });
        });
      })
      .catch(next);
  })
  // missing requireAuth
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(req.user)).catch(next);
  });

module.exports = usersRouter;
