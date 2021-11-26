const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'test@email.com',
      password: 'Password87',
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'test2@email.com',
      password: 'Passwordtest2',
    },
    {
      id: 3,
      username: 'test-user-3',
      email: 'test3@email.com',
      password: 'Passwordtest3',
    },
  ];
}

function makeRecipesArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      name: 'Stomboli',
      category: 'Italian',
      type: 'dinner',
    },
    {
      id: 2,
      user_id: users[1].id,
      name: 'Cereal',
      category: 'carbs',
      type: 'breakfast',
    },
    {
      id: 3,
      user_id: users[2].id,
      name: 'Broccoli',
      category: 'vegetarian',
      type: 'snack',
    },
    {
      id: 4,
      user_id: users[2].id,
      name: 'Beef Stroganoff',
      category: 'meat',
      type: 'lunch',
    },
    {
      id: 5,
      user_id: users[2].id,
      name: 'Spaghetti',
      category: 'meat/carbs',
      type: 'dinner',
    },
  ];
}

function makeMealPlanArray(users, recipes) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      recipe_id: recipes[0].id,
      meal_type: 'dinner',
      day_of_week: 'monday',
    },
    {
      id: 2,
      user_id: users[1].id,
      recipe_id: recipes[1].id,
      meal_type: 'breakfast',
      day_of_week: 'tuesday',
    },
    {
      id: 3,
      user_id: users[2].id,
      recipe_id: recipes[2].id,
      meal_type: 'snack',
      day_of_week: 'monday',
    },
    {
      id: 4,
      user_id: users[2].id,
      recipe_id: recipes[3].id,
      meal_type: 'lunch',
      day_of_week: 'monday',
    },
    {
      id: 5,
      user_id: users[2].id,
      recipe_id: recipes[4].id,
      meal_type: 'dinner',
      day_of_week: 'monday',
    },
  ];
}

function makeMaliciousUser() {
  const maliciousUser = {
    username: 'Naughty naughty very naughty <script>alert("xss");</script>',
    email: 'Naughty naughty very naughty <script>alert("xss");</script>',
    password: '11Naughty naughty very naughty <script>alert("xss");</script>',
  };
  const expectedUser = {
    username: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    email: 'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    password: '11Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousUser,
    expectedUser,
  };
}

function makeMaliciousRecipe() {
  const maliciousRecipe = {
    id: 1,
    user_id: users[0].id,
    name:
      'image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    category:
      'image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    type: 'dinner',
  };
  const expectedRecipe = {
    id: 1,
    user_id: users[0].id,
    name: `image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    category: `image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    type: 'dinner',
  };
  return {
    maliciousRecipe,
    expectedRecipe,
  };
}

function makeMaliciousMealPlan() {
  const maliciousMealPlan = {
    id: 1,
    user_id: users[0].id,
    recipe_id: recipes[0].id,
    meal_type:
      'image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
    day_of_week: 'monday',
  };
  const expectedMealPlan = {
    id: 1,
    user_id: users[0].id,
    recipe_id: recipes[0].id,
    meal_type: `image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    day_of_week: 'monday',
  };
  return {
    maliciousMealPlan,
    expectedMealPlan,
  };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}
