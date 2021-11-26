require('dotenv').config();

const { PORT, DATABASE_URL, TEST_DATABASE_URL } = require('./config');
const app = require('./app');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
