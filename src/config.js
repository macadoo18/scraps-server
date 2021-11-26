module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/scraps',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/scraps_test',
  JWT_SECRET: process.env.JWT_SECRET || 'apodifnowdv123npon13n4p77421l',
};
